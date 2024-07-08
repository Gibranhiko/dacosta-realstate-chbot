const { google } = require("googleapis");

const googleCalendarId = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.GoogleAuth({
  keyFile: "./mw-chatbot-426817-3902ebe1254e.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3" });

const calendarID = googleCalendarId;
const timeZone = "America/Mexico_City";

const rangeLimit = {
  days: [1, 2, 3, 4, 5],
  startHour: 9,
  endHour: 18,
};

const standardDuration = 1;

const dateLimit = 30;

async function createEvent(
  eventName,
  description,
  date,
  duration = standardDuration
) {
  try { 
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const startDateTime = new Date(date);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(
      startDateTime.getHours() + duration
    );

    const event = {
      summary: eventName,
      description: description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timeZone,
      },
      colorId: "2",
    };

    const response = await calendar.events.insert({
      calendarId: calendarID,
      resource: event,
    });

    const eventId = response.data.id;
    console.log("Evento creado con exito");
    return eventId;
  } catch (err) {
    console.error(
      "Hubo un error al cargar el evento en el servicio de calendar"
    );
    throw err;
  }
}

async function listAvailableSlots(startDate = new Date(), endDate) {
  try {
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + dateLimit);
    }

    const response = await calendar.events.list({
      calendarId: calendarID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      timeZone: timeZone,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    const slots = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      if (rangeLimit.days.includes(dayOfWeek)) {
        for (
          let hour = rangeLimit.startHour;
          hour < rangeLimit.endHour;
          hour++
        ) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(hour + standardDuration);

          const isBusy = events.some((event) => {
            const eventStart = new Date(
              event.start.dateTime || event.start.date
            );
            const eventEnd = new Date(event.end.dateTime || event.end.date);
            return slotStart < eventEnd && slotEnd > eventStart;
          });
          if (!isBusy) {
            slots.push({ start: slotStart, end: slotEnd });
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return slots;
  } catch (err) {
    console.error(
      "Hubo un error al cargar el evento en el servicio de calendar"
    );
    throw err;
  }
}

async function getNextAvailableSlot(date) {
  try {
    if (typeof date === "string") {
      date = new Date(date);
    } else if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("La fecha proporcionada no es valida");
    }

    const availableSlots = await listAvailableSlots(date);

    const filteredSlots = availableSlots.filter(
      (slot) => new Date(slot.start) > date
    );

    const sortedSlots = filteredSlots.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    return sortedSlots.length > 0 ? sortedSlots[0] : null;
  } catch (err) {
    console.error("Hubo un error al obtener el próximo slot disponible");
    throw err;
  }
}

async function isDateAvailable(date) {
  try {
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + dateLimit);

    if (date < currentDate || date > maxDate) {
      return false;
    }

    const dayOfWeek = date.getDay();
    if (!rangeLimit.days.includes(dayOfWeek)) {
      return false;
    }

    const hour = date.getHours();
    if (hour < rangeLimit.startHour || hour >= rangeLimit.endHour) {
      return false;
    }

    const availableSlots = await listAvailableSlots(currentDate);

    const slotsOnGivenDate = availableSlots.filter(
      (slot) => new Date(slot.start).toDateString() === date.toDateString()
    );

    const isSlotAvailable = slotsOnGivenDate.some(
      (slot) =>
        new Date(slot.start).getTime() === date.getTime() &&
        new Date(slot.end).getTime() ===
          date.getTime() + standardDuration * 60 * 60 * 1000
    );

    return isSlotAvailable;
  } catch (err) {
    console.error("Hubo un error al verificar la disponibilidad de la fecha");
    throw err;
  }
}

module.exports = { createEvent, isDateAvailable, getNextAvailableSlot };
