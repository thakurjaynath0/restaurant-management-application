const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)
const generateQR = require('../qrcode/qrcode');
const SETTINGS = require('../../settings');


const defaultSettings = { 
    height:"15cm", 
    width:"10cm",
    scale:0.7,
    margin:{
        left:'0cm',
        right:'0cm',
        top:'0cm',
        bottom:'0cm'
    }

}

async function getTemplateHtml(){
    try{
        const invoicePath = path.resolve(__dirname,'./templates/template2.html');
        return await readFile(invoicePath, 'utf8');
    } catch (e) {
        return Promise.reject('Couldn\'t load html template .');
    }

}


async function generatePdf(settings = defaultSettings, data={}){
    settings = {...defaultSettings, ...settings};
    settings.path = path.join(SETTINGS.MEDIA_ROOT, settings.filePath);

    try{
        let qr = await generateQR(SETTINGS.DOMAIN+SETTINGS.MEDIA_URL+"/view"+settings.filePath, `${data.orderId}.png`);
        let htmlCode = await getTemplateHtml();
        const template = hb.compile(htmlCode, { strict: true });
        const result = template({...data, qr, SETTINGS});
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(result);

        await page.pdf(settings);
        await browser.close();
        
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = generatePdf;