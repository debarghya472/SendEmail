const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const config = require('./config/config');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Hello email sender!");
});

app.post('/send',(req,res)=>{
    const emailbody = `
    <p>This is a test mail</p>
    <h3>Contact </h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  console.log(req.body.name, req.body.message);
    let transporter = nodemailer.createTransport({
        host: 'stud.iitp.ac.in',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.email, // generated ethereal user
            pass: config.password  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });
    
    let mailOptions = {
        from: '"Debarghya Maity" <debarghya_1901me19@iitp.ac.in>', // sender address
        to:  'debarghyamaity@gmail.com', // list of receivers
        subject: 'Just For Check', // Subject line
        text: 'Hello world', // plain text body
        html:  emailbody// html body
    };  

console.log(emailbody);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send("Unsuccessful attempt")
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.send("email sent successfully");
    });

});

app.listen(2000, ()=>{
    console.log('Server started at port 2000....');
});