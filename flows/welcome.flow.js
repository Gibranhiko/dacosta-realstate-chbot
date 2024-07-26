const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const welcomeFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Hola bienvenido a D´Acosta Real State, ¿Dime en qué te puedo ayudar?"
  )
  .addAnswer(
    "Escribe el número o nombre de la opción que prefieras"
  )
  .addAnswer([
    "*1. Comprar* - Quiero comprar una propiedad",
    "*2 Crédito* - Necesito un crédito hipotecario"
  ]);

module.exports = { welcomeFlow };