require('dotenv').config();

let sender = process.env.EMAIL || "verification.account@hey-flow.com";
let password = process.env.EMAIL_PASS || "kasperSkyluminate1@";
let smtp = process.env.SMTP_MAIL || "hey-flow.com";

var nodeMailer = require('nodemailer');
var EmailTemplate = require('email-templates');
var ejs = require("ejs");

let transporter = nodeMailer.createTransport({
    host: smtp,
    auth: {
      user: sender,
      pass: password
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("verify email :" + error);
  } else {
    console.log('Server is ready to take messages');
  }
});

exports.sendEmail = function(type, datas) {
    let temp;
    if(type == 'reset-password') {
        temp = 'reset-password.ejs';
    }
    if(type == 'bidding-status') {
        temp = 'biddingStatus.ejs';
    }
    if(type == 'order') {
        temp = 'order.js';
    }
    if(type == 'payment') {
        temp = 'payment.ejs';
    }
    if(type == 'verification') {
        temp = 'verification.ejs';
    }
    if(type == 'deliver-receipt') {
      temp = 'deliver-receipt.ejs';
    }
    ejs.renderFile(__dirname + "/../resources/static/template/email/" + temp, datas, function (err, data) {
      if (err) {
          console.log("error on ejs render : " + err);
      } else {
          var mainOptions = {
              from: sender,
              to: datas.useremail,
              subject: datas.subject,
              html: data
          };
          transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
              return false;
            } else {
              return true;
            }
        });
        }
    });
}
