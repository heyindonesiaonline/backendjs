const bcrypt         = require('bcryptjs');
const bcrypt_p       = require('bcrypt-promise');
const { AccessToken } = require('../../models');
const { User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const mailer = require('../../services/email.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

//new code
var response = require('../../response/res');
var connection = require('../../config/conn');
var nodemailer = require('nodemailer');
var this_host = 'hey-flow.com';
var this_user = 'verification.account@hey-flow.com';
var this_pass = 'kasperSkyluminate1@';
//

const requestReset = async function (req, res) {
    let err, data, errcheck, users, errmail, sendmail;
    var today = new Date();

    [errcheck, users] = await to(User.findOne({
        where: {
          email: req.body.email
        }
      }));
    if(errcheck) return ReE(res, errcheck, 422);
    if(users == null ) return ReE(res, {message: 'No User Found With The Email Given'}, 422);
      console.log(users.id);
    let token = Math.floor(1000 + Math.random() * 9000);

    [err, data] = await to(AccessToken.create({
      refId: users.id,
      type: 'reset-password',
      token: token,
      url: '',
      status: 0,
      expired: today.setHours(today.getHours() + 4)
    }));
    if(err) return ReE(res, err, 422);

    let dataToken = data.toWeb();

    // sendmail = mailer.sendEmail('reset-password', {
    //   subject: 'Request Reset password',
    //   useremail: users.email,
    //   userfullname: users.first + " " + users.last,
    //   token: data.token,
    //   expired: data.expired
    // });
    
    // if( sendmail == false ) TE("Can't Send Email", true);
    //send email
      var transporter = nodemailer.createTransport({
        host: this_host,
        port : '465',
        secure : true,
        // protocol : 'smtp',
        auth: {
        user: this_user,
        pass: this_pass
        }
    });

    var mailOptions = {
    from: this_user,
    to: users.email,
    subject: 'OTP Code',
    html: "<!DOCTYPE html><html><head><title>OTP Code</title><style>* {box-sizing: border-box;}.columnOrder {float: left;width: 25%;padding: 10px;height: 100px;}.columnCheckout {float: left;width: 33.3%;padding: 10px;height: 100px;}.column10 {float: left;width: 10%;padding: 10px;height: 150px;}.column20 {float: left;width: 20%;padding: 10px;height: 150px;}.column30 {float: left;width: 30%;padding: 10px;height: 150px;}.column20Total {float: left;width: 20%;padding: 10px;height: 80px;}.column30Total {float: left;width: 30%;padding: 10px;height: 80px;}.column30garis {float: left;width: 30%;padding: 10px;height: 10px;}.column40 {float: left;width: 40%;padding: 10px;height: 150px;}.column40garis {float: left;width: 40%;padding: 10px;height: 10px;}.row:after {content: '';display: table;clear: both;}</style></head><body style='background-image: url('http://bidbong.hey-io.com/assets/email/bg_email.jpg');background-repeat: no-repeat;background-size: 100% 100%;'><center><img style='height: 100px;width: 100px;' src='http://bidbong.hey-io.com/assets/bidbong_logo.png'></center><center><p>Hi User, Thank you for enjoy with BidBong <br> You just request OTP Code</p><br/><p><b>OTP Code : "+data.token+"<b/></p><br/><p>For security reason, do not give your OTP Code to anyone</p><br/></center><div style='background: rgba(196, 196, 196, 0.25);margin: auto;padding: 10px;'><center><p>Contact Us Contact@BidBong.com | +44 33 01 33 25 19 <br/>© 2021 bidbong.com - All Rights Reserved</p></center></div></body></html>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        console.log('transporter');
        if (error){
            console.log('4');
            console.log(info);
            console.log(error);
        }else{
            console.log('email send' + info.response);
        }
        console.log('transporter done email otp');
    });
    //

    return ReS(res,{message: 'Success Add New Token', data:dataToken, user: users}, 201);
}
module.exports.requestReset = requestReset;

const checkToken = async function (req, res) {
    let err, data;
    [err, data] = await to(AccessToken.findOne({
      where: {
        token: req.body.token,
        expired: {
          [Op.gte]: new Date()
        },
        status: 0
      }
    }));
    if(err) return ReE(res, err, 422);

    if(data == null) return ReE(res, {message: 'No Token Found'}, 422); 
    
    return ReS(res,{message: 'Token Found And Can Be Use', data:data}, 201);
}
module.exports.checkToken = checkToken;

const changePassword = async function (req, res) {
    let err, data, errcheck, checktoken;
    let salt, hash;

    let userToken = req.body;

    console.log(userToken);

    [err, salt] = await to(bcrypt.genSalt(10));
    if(err) return ReE(res, err, 422);
    
    [err, hash] = await to(bcrypt.hash(userToken.password, salt));
    if(err) return ReE(res, err, 422);
    
    let newpassword = hash;

    [err, data] = await to(User.update({
      password: newpassword
    }, {
      where: {
        id: userToken.userId
      }
    }));

    if(err) return ReE(res, err, 422);

    [errcheck, checktoken] = await to(AccessToken.update(
      {
        status: 1
      }, 
      {
        where: {
          refId: userToken.userId,
          token: userToken.token
        }
      }
    ));

    if(errcheck) return ReE(res, errcheck, 422);
    //new code
    let sql_detail_user = "SELECT * FROM Users WHERE id ="+userToken.userId;
    console.log(sql_detail_user);
    connection.query(sql_detail_user,function(error,rows,fields){
    if(error){
          console.log(error);
    }else{
          var data_json = JSON.stringify(rows);
          result = data_json.replace(/(^\[)/,'');
          result = result.replace(/(\]$)/,'');
          obj = JSON.parse(result);
          var email_user = obj.email;
          var name_user = obj.first;

          console.log(email_user);
          console.log(name_user)
          
          //send email
          var transporter = nodemailer.createTransport({
              host: this_host,
              port : '465',
              secure : true,
              // protocol : 'smtp',
              auth: {
              user: this_user,
              pass: this_pass
              }
          });

          var mailOptions = {
          from: this_user,
          to: email_user,
          subject: 'Forget Password',
          html: "<!DOCTYPE html><html><head><title>Forget Password</title><style>* {box-sizing: border-box;}.columnOrder {float: left;width: 25%;padding: 10px;height: 100px;}.columnCheckout {float: left;width: 33.3%;padding: 10px;height: 100px;}.column10 {float: left;width: 10%;padding: 10px;height: 150px;}.column20 {float: left;width: 20%;padding: 10px;height: 150px;}.column30 {float: left;width: 30%;padding: 10px;height: 150px;}.column20Total {float: left;width: 20%;padding: 10px;height: 80px;}.column30Total {float: left;width: 30%;padding: 10px;height: 80px;}.column30garis {float: left;width: 30%;padding: 10px;height: 10px;}.column40 {float: left;width: 40%;padding: 10px;height: 150px;}.column40garis {float: left;width: 40%;padding: 10px;height: 10px;}.row:after {content: '';display: table;clear: both;}</style></head><body style='background-image: url('http://bidbong.hey-io.com/assets/email/bg_email.jpg');background-repeat: no-repeat;background-size: 100% 100%;'><center><img style='height: 100px;width: 100px;' src='http://bidbong.hey-io.com/assets/bidbong_logo.png'></center><center><p>Hi "+name_user+", Thank you for enjoy with BidBong <br> You just changed your BidBong account password</p><br/><img style='height: 220px;width: 20%;' src='http://bidbong.hey-io.com/assets/email/lock.png'><br/><p><b>Your Password has been Successfully changed. <br/> Please log in with new password</b></p><br/><p>For security reason, do not give your password to anyone, and change your <br/>password regularly</p><br/></center><div style='background: rgba(196, 196, 196, 0.25);margin: auto;padding: 10px;'><center><p>Contact Us Contact@BidBong.com | +44 33 01 33 25 19 <br/>© 2021 bidbong.com - All Rights Reserved</p></center></div></body></html>"
          };

          transporter.sendMail(mailOptions, function(error, info){
              console.log('transporter');
              if (error){
                  console.log('4');
                  console.log(info);
                  console.log(error);
              }else{
                  console.log('email send' + info.response);
              }
              console.log('transporter done');
          });
          //
    }
    });
    //

    return ReS(res,{message: 'Success Reset Password'}, 201);
}
module.exports.changePassword = changePassword;
