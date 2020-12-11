const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./config/client_secret.json');
const doc = new GoogleSpreadsheet('1oA_MqTHBw8X6PfWVJtR-QilnzFnzH3nTY3K6WwyG-cE');

async function test() {
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key
    });

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

}
test();