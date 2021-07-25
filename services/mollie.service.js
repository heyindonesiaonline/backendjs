require('dotenv').config();

const { createMollieClient } = require('@mollie/api-client');
const { to, ReE, ReS, TE }    = require('../services/util.service');

let getAPI = process.env.mollie_api || "1234";
let hostname = process.env.HOSTNAME || "localhost";
let port = process.env.PORT || "3033";

const mollieClient = createMollieClient({ apiKey : getAPI });

const createPayment = async function () {
    let payerr, paydata;
    [payerr, paydata] = await to(
        mollieClient.payments.create({
            amount: {
              currency: 'EUR',
              value: '10.00', // You must send the correct number of decimals, thus we enforce the use of strings
            },
            method: 'creditcard',
            description: 'My first payment',
            redirectUrl: 'https://webshop.example.org/order/12345/',
            webhookUrl: 'https://webshop.example.org/payments/webhook/',
            metadata: {
              order_id: '12345',
            },
        })
    );
    console.log("if error");
    console.log(payerr);
    console.log("if success");
    console.log(paydata);

}
module.exports.createPayment = createPayment;

const getPayment = async function (datas) {
    let payerr, paydata;
    [payerr, paydata] = await to(mollieClient.payments.get('tr_Eq8xzWUPA4'));
}
module.exports.getPayment = getPayment;

const cancelPayment = async function () {
    let payerr, paydata;
    [payerr, paydata] = await to(mollieClient.payments.delete('tr_Eq8xzWUPA4'));
}
module.exports.cancelPayment = cancelPayment;

const webhookPayment = async function (datas) {
    let payerr, paydata;
    [payerr, paydata] = await to(mollieClient.payments.get('tr_Eq8xzWUPA4'));

    if(payerr) return TE("Error Get Detail");

    const isPaid = paydata.isPaid();
    if(!isPaid) return ReE(res, paydata.status, 422);
    
    return paydata.status;

}
module.exports.webhookPayment = webhookPayment;

const methodPayment = async function (datas) {
    let methoderr, methodlist;
    [methoderr, methodlist] = await to(mollieClient.methods.all());

    console.log("if error");
    console.log(methoderr);
    console.log("if success");
    console.log(methodlist);

    // return methodlist;


}
module.exports.methodPayment = methodPayment;