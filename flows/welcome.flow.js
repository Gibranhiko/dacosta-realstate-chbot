const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const welcomeFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Hola bienvenido a D´Acosta Real State, ¿Dime en qué te puedo ayudar?", { delay: 1000 }
  )
  .addAnswer(
    "Escribe el número o nombre de la opción que prefieras", { delay: 1000 }
  )
  .addAnswer([
    "*1. Comprar* - Quiero comprar una propiedad",
    "*2 Crédito* - Necesito un crédito hipotecario"
  ], { delay: 1000 });

module.exports = { welcomeFlow };