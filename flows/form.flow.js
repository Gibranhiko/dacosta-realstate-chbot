const {addKeyword, EVENTS} = require('@bot-whatsapp/bot');
const {createEvent} = require('../scripts/calendar');

const formFlow = addKeyword(EVENTS.ACTION)
    .addAnswer('Excelente, gracias por confirmar la fecha. Voy a hacer unas preguntas para agendar tu cita. ¿Cuál es tu nombre?', {capture: true},
        async (ctx, ctxFn) => {
            await ctxFn.state.update({name: ctx.body});
        }
    )
    .addAnswer('Perfect, ¿Cuál es el motivo de tu consulta?', {capture: true},
        async (ctx, ctxFn) => {
            await ctxFn.state.update({motive: ctx.body});
        }
    )
    .addAnswer('Excelente, reunión agendada, te esperamos.', null,
        async (ctx, ctxFn) => {
            const userInfo = await ctxFn.state.getMyState();
            const eventName = userInfo.name;
            const description = userInfo.motive;
            const date = userInfo.date;
            const eventId = await createEvent(eventName, description, date);
            console.log(eventId, 'id del evento');
            await ctxFn.state.clear();
        }
    )

    module.exports = {formFlow}