const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const creditFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(
        "Credit Flow"
    )

module.exports = { creditFlow };