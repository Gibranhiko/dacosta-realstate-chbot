const { google } = require("googleapis");

const spreadsheetId = '1zzK2_3-5DKhtArORAtbfLFdQN10MV1NmTk3QeczML4o';

const auth = new google.auth.GoogleAuth({
  keyFile: "./dacosta-rs-chatbot-f7a9600b0256.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function readSheet(range) {
    const sheets = google.sheets({
        version: 'v4', auth
    });
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId, range
        });
        const rows = response.data.values;
        return rows;
    } catch (error) {
        console.error('error', error)
    }
}

module.exports = {readSheet}