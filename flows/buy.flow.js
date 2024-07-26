const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { readSheet } = require('../scripts/sheets');
const { removeDuplicatesAndJoin, filterAndFormatByZone } = require('../scripts/utils');
const { bookingFlow } = require("./booking.flow");

const buyFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Perfecto, estas son las zonas que tenemos disponibles", null, async (_, { flowDynamic }) => {
        const zones = await readSheet('Hoja 1!B2:B');
        const zonesRender = removeDuplicatesAndJoin(zones);
        await flowDynamic(zonesRender);
    })
    .addAnswer("¿Cuál zona eliges?", { capture: true }, null)
    .addAnswer("Dame 1 segundo, para mostrarte las propiedades en esa zona...", null, async (ctx, { flowDynamic, fallBack }) => {
        const propertyList = await readSheet("Hoja 1!A:E");
        const propertyListRender = filterAndFormatByZone(propertyList, ctx.body);

        if (propertyListRender.length > 0) {
            await flowDynamic(propertyListRender);
        } else {
            await flowDynamic('Lo siento, no tenemos propiedades en esa zona.');
            return fallBack();
        }
    })
    .addAnswer('¿Deseas agendar una cita con un asesor? Responde solo *si* o *no*', { capture: true },
        async (ctx, ctxFn) => {
            if (ctx.body.toLowerCase() === 'si') {
                return ctxFn.gotoFlow(bookingFlow);
            } else {
                await ctxFn.endFlow(
                    'Muy bien gracias, si puedo ayudarte en algo más solo escribe "menú"'
                );
            }
        })

module.exports = { buyFlow };