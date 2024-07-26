const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { text2iso, iso2Text } = require("../scripts/utils");
const {
  isDateAvailable,
  getNextAvailableSlot,
} = require("../scripts/calendar");
const { chat } = require("../scripts/chatgpt");
const { confirmationFlow } = require("./confirmation.flow");

const promptBase = `
    Eres un asistente virtual diseñado para ayudar a los usuarios a agendar citas mediante una conversación.
    Tu objetivo es unicamente ayudar al usuario a elegir un horario y una fecha para sacar turno.
    Te voy a dar la fecha solicitada por el usuario y la disponibilidad de la misma. Esta fecha la tiene
    que confirmar el usuario. 
    Si la disponibilidad es true, entonces responde algo como: La fecha solicitada está disponible. El turno 
    será el Jueves 30 de mayo 2024 a las 10:00 hrs.
    Si la disponibilidad es false, entonces recomienda la siguiente fecha disponible que te dejo al final 
    del promp, suponiendo que la siguiente fecha disponible es el Jueves 30, responde con este formato:
    La fecha y horario solicitados no estan disponibles, te puedo ofrecer el Jueves 30 de mayo 2024 a las 
    11:00 hrs.
    Bajo ninguna circunstancia hagas consultas.
    En vez de decir que la disponibilidad es false, envía una disculpa mencionado que esa fecha no está
    disponible y ofrece la siguiente.
    Te dejo los estados actualizados de dichas fechas
`;

const bookingFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("Perfecto! Que fecha quieres agendar?", { capture: true })
  .addAnswer("Revisando disponibilidad...", null, async (ctx, ctxFn) => {
    const currentDate = new Date();
    const requestedDate = await text2iso(ctx.body);

    if (requestedDate.includes("false")) {
      return ctxFn.endFlow(
        "No se pudo determinar una fecha. Volver a preguntar"
      );
    }

    const startDate = new Date(requestedDate);
    let dateAvailable = await isDateAvailable(startDate);

    if (dateAvailable === false) {
      const nextDateAvailable = await getNextAvailableSlot(startDate);
      const isoString = nextDateAvailable.start.toISOString();
      const dateText = await iso2Text(isoString);
      const messages = [{role:'user', content:`${ctx.body}`}];
      const response = await chat(promptBase + '\nHoy es el día: ' + currentDate + '\nLa fecha solicitada es: ' + requestedDate + '\nLa disponibilidad de esa fecha es: false' + '\nEl próximo espacio disponible que tienes que ofrecer es: ' + dateText + 'Da la fecha siempre en español', messages);
      await ctxFn.flowDynamic(response);
      await ctxFn.state.update({date: nextDateAvailable.start});
      return ctxFn.gotoFlow(confirmationFlow);
    } else {
        const messages = [{role:'user', content:`${ctx.body}`}];
        const response = await chat(promptBase + '\nHoy es el día: ' + currentDate + '\nLa fecha solicitada es: ' + requestedDate + '\nLa disponibilidad de esa fecha es: true' + '\nConfirmación del cliente: No confirmó', messages);
        await ctxFn.flowDynamic(response);
        await ctxFn.state.update({date: startDate});
        return ctxFn.gotoFlow(confirmationFlow);
    }
  });

  module.exports = {bookingFlow};
