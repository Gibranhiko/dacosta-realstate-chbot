const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const { formFlow } = require("../flows/form.flow");

const confirmationFlow = addKeyword(EVENTS.ACTION)
    .addAnswer('Confirmas la fecha propuesta? Responde solo un "si" o "no"' , {capture: true},
      async (ctx, ctxFn) => { 
          if (ctx.body.toLowerCase() === 'si') {
              return ctxFn.gotoFlow(formFlow);
          } else {
          await ctxFn.endFlow(
              "Reserva cancelada, vuelve a solicitar una reserva para elegir otra fecha."
          );
          }
      }
  );
  module.exports = {confirmationFlow};