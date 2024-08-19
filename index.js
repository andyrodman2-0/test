//packages
const axios = require("axios");
const cheerio = require("cheerio");
require('dotenv').config();
const accountSid = process.env.twilio_account_sid;
const authToken = process.env.twilio_auth_token;
const client = require("twilio")(accountSid, authToken);

const url = 
"https://www.amazon.com/i9-14900K-Desktop-Processor-Integrated-Graphics/dp/B0CGJDBCTK/ref=sr_1_1_sspa?crid=2ILY8941KSJOW&dib=eyJ2IjoiMSJ9.rpm_HDQxtDFXPjNBD2o5K00rDSbZ2Zab3VNGfFaXrzplRRvhlqmZKsuc79FEJM0Ku-w0eCm-VVNtMXGRIUZrE1FIDRpEHJiu485ECm7KxM-dvwPk64c_1f7Dcq3Azg3ay_51ZlF4dePeaf5ct2Uj1Qlci_jqKF2EzKYRtu9NpLXYZuRZDY7Clr-4nwrXTvYtOVDlLrmOsekigZxgAbTITDlaMQ7xjshz9g3LupUSaYA._RHcmSQN6PAwilB5ZTqTcYD_xzO9p2296ijt-D6fSIE&dib_tag=se&keywords=intel%2Bi9%2B14900k&qid=1723753646&sprefix=intel%2Bi9%2Caps%2C178&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"

const product = {name:'', price:"", link:"" };

//Set intervaL
const handle = setInterval(index, 20000);

async function index() {
    //fetch the data
    const { data } = await axios.get(url);
    //load up the html
    const $ = cheerio.load(data);
    const item = $("div#a-page");
    //Extract the data that we need
    product.name = $(item).find("h1 span#productTitle").text();
    product.link = url;
    const price = $(item)
    .find('span .a-price-whole')
    .first()
    .text()
    .replace(/[,.]/g, "");
    const priceNum =parseInt(price);
    product.price = priceNum;
    console.log(product);

    //send an SMS
    if(priceNum < 600) {
        client.messages
        .create({
            body: `The price of ${product.name} went below ${price}. purchase it at ${product.link}`,
         from: "+18552383103",
            to:'+14808239640',
        })
        .then((message) => {
            console.log(message);
            clearInterval(handle);
});
    }
}    


    index();