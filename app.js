const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const config = require('./config/config');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./config/client_secret.json');
const path = require('path');
const { email } = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello email sender!");
});

app.post('/send', (req, res) => {
    // sendmail(req, res);
    accessSpreadSheet(req,res);

});

app.listen(2000, () => {
    console.log('Server started at port 2000....');
});

function sendmail(req, res,Email) {
    const emailbody = `
    <p>This is a test mail</p>
    <h3>Contact </h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
    let transporter = nodemailer.createTransport({
        host: 'stud.iitp.ac.in',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.email, // generated ethereal user
            pass: config.password  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"Debarghya Maity" <debarghya_1901me19@iitp.ac.in>', // sender address
        to: Email, // list of receivers
        subject: 'Just For Check', // Subject line
        text: 'Hello world', // plain text body
        html: emailbody// html body
    };
    var success = 0;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send("Unsuccessful attempt")
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        success =1;
        res.send("email sent successfully");
    });
    if (success == 1)
       return true;
    else
        return false;
}

async function accessSpreadSheet(req,res) {
    const doc = new GoogleSpreadsheet('1oA_MqTHBw8X6PfWVJtR-QilnzFnzH3nTY3K6WwyG-cE');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key
    });

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title,);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    // console.log(sheet.title);
    // console.log(sheet.rowCount);

    const rows = await sheet.getRows(); // can pass in { limit, offset }
    // console.log(rows[0].email);

    rows.forEach(row =>{

        if(!sendmail(req,res,row.email)){
            console.log(row.email);
            row.sent = 'Y';
            row.save();
        }
    });
}