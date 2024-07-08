// const { chat } = require('./chatgpt');
// const { DateTime } = require('luxon');

// function iso2Text(iso) {
//     try {
//         const dateTime = DateTime.fromISO(iso, {zone: 'utc'}).setZone('America/Mexico_City');

//         const formattedDate = dateTime.toLocaleString({
//             weekday: 'long',
//             day: '2-digit',
//             month: 'long',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false, 
//             timeZoneName: 'short'
//         });

//         return formattedDate;

//     } catch (err) {
//         console.error('Error al convertir la fecha: ', err);
//         return 'Formato de fecha no valido';
//     }
// }

// async function text2iso (text) {
//     const currentDate = new Date();

//     const prompt = 'La fecha de hoy es: ' + currentDate + `Te voy a dar un texto.
//     Necesito que de ese texto extraigas la fecha y la hora del texto que te voy a dar y
//     respondas con la misma en formato ISO.

//     Me tienes que responder EXCLUSIVAMENTE con esa fecha y horarios en formato ISO, 
//     usando el horario 10:00 en caso de que no este especificada la hora.

//     Por ejemplo, el texto puede ser algo como "el jueves 30 de mayo a las 12hs". En ese
//     caso tu respuesta tiene que ser 2024-06-30T12:00:00.0000.

//     Por ejemplo, el texto puede ser algo como "este viernes 31". En ese caso tu respuesta
//     tiene que ser 2024-06-31T10:00:00.000.

//     Si el texto es algo como: Mañana 10am, sumarle un día a la fecha actual y dar eso 
//     como resultado.

//     Si el texto no tiene sentido, responde "false"`

//     const messages = [{role: 'user', content: `${text}`}]

//     const response = await chat(prompt, messages);

//     return response.trim();
// }

// module.exports = {text2iso, iso2Text};

function removeDuplicatesAndJoin(data) {
    let flatData = data.map(item => item[0]);
    let uniqueData = [...new Set(flatData)];
    let result = uniqueData.join(', ');

    return result;
}

function filterAndFormatByZone(data, zone) {
    console.log(data, zone);
    let filteredData = data.filter(item => item[1] === zone);
    console.log(filteredData);

    let formattedString = filteredData.map(item => {
        return `${item[0]} en ${item[1]}, Fraccionamiento ${item[2]}, número ${item[3]}`;
    }).join('\n');
    
    return formattedString;
}

module.exports = {removeDuplicatesAndJoin, filterAndFormatByZone}