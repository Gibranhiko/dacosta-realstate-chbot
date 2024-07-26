const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS,
  } = require("@bot-whatsapp/bot");
  
  const QRPortalWeb = require("@bot-whatsapp/portal");
  const BaileysProvider = require("@bot-whatsapp/provider/baileys");
  const MockAdapter = require("@bot-whatsapp/database/mock");
  
  const { welcomeFlow } = require("./flows/welcome.flow");
  const { buyFlow } = require("./flows/buy.flow");
  const { creditFlow } = require("./flows/credit.flow");
  const { bookingFlow } = require("./flows/booking.flow");
const { confirmationFlow } = require("./flows/confirmation.flow");
const { formFlow } = require("./flows/form.flow");
  
  function containsKeyword(keywordsArr, bodyText) {
    return keywordsArr.some((keyword) => bodyText.includes(keyword));
  }
  
  const flowStart = addKeyword(EVENTS.WELCOME).addAction(async (ctx, ctxFn) => {
    const bodyText = ctx.body.toLowerCase();
  
    const keywordsWelcome = ["hola", "ola", "alo", "hello", "olis", "menu"];
    const containsKeywordWelcome = containsKeyword(keywordsWelcome, bodyText);
  
    const keywordsBuy = ["1", "comprar"];
    const containsKeywordBuy = containsKeyword(keywordsBuy, bodyText);
  
    const keywordsCredit = ["2", "credito"];
    const containsKeyworCredit = containsKeyword(keywordsCredit, bodyText);
  
    if (containsKeywordWelcome && ctx.body.length < 8) {
      return await ctxFn.gotoFlow(welcomeFlow);
    }
  
    if (containsKeywordBuy) {
      return ctxFn.gotoFlow(buyFlow);
    } else if (containsKeyworCredit) {
      return await ctxFn.gotoFlow(creditFlow);
    } else {
      return await ctxFn.endFlow("Disculpa, no entiendo tu solicitud, escribe *menu* para más opciones.")
    }
  });
  
  const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
      flowStart,
      welcomeFlow,
      buyFlow,
      creditFlow,
      bookingFlow,
      confirmationFlow,
      formFlow
    ]);
    const adapterProvider = createProvider(BaileysProvider);
  
    createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });
  
    QRPortalWeb();
  };
  
  main();
  