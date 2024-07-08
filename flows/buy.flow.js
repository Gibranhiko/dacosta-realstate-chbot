const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { readSheet } = require('../scripts/sheets');
const { removeDuplicatesAndJoin, filterAndFormatByZone } = require('../scripts/utils');

const buyFlow = addKeyword(EVENTS.ACTION)
.addAnswer("Perfecto, estas son las zonas que tenemos disponibles", null, async (ctx, ctxFn) => {
    const zones = await readSheet('Hoja 1!B2:B');
    const zonesRender = removeDuplicatesAndJoin(zones);
    await ctxFn.flowDynamic(zonesRender);
})
.addAnswer("¿Cuál zona eliges?", {capture: true}, null)
.addAnswer("Revisando las propiedades...", null, async (ctx, ctxFn) => {
    const response = await readSheet("Hoja 1!A1:D");
    const responseRender = filterAndFormatByZone(response, ctx.body);
    console.log(responseRender, 'casas de la zona');
    await ctxFn.flowDynamic(responseRender);
})

module.exports = { buyFlow };