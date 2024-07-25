const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { readSheet } = require('../scripts/sheets');
const { removeDuplicatesAndJoin, filterAndFormatByZone } = require('../scripts/utils');

const buyFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Perfecto, estas son las zonas que tenemos disponibles", null, async (_, { flowDynamic }) => {
        const zones = await readSheet('Hoja 1!B2:B');
        const zonesRender = removeDuplicatesAndJoin(zones);
        await flowDynamic([{ body: zonesRender, delay: 500 }]);
    })
    .addAnswer("¿Cuál zona eliges?", { capture: true }, null)
    .addAnswer("Dame 1 segundo, para mostrarte las propiedades en esa zona...", null, async (ctx, { flowDynamic, fallBack }) => {
        const propertyList = await readSheet("Hoja 1!A:E");
        const propertyListRender = filterAndFormatByZone(propertyList, ctx.body);

        if (propertyListRender.length > 0) {
            await flowDynamic(propertyListRender);
        } else {
            await flowDynamic([{ body: 'Lo siento, no tenemos propiedades en esa zona.', delay: 1000 }]);
            return fallBack();
        }
    })

module.exports = { buyFlow };