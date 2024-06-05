const { readFile } = require('fs').promises;
const SETTINGS = require('../settings');
const path = require('path');
const CustomError = require('../errors');
const hb = require('handlebars');

const viewPdf = async (req, res) => {
    const { pdfName } = req.params;
    const pdfPath = path.join(SETTINGS.MEDIA_ROOT, `/pdf/${pdfName}`);
    const pdfViewerPath = path.join(__dirname, '../templates/pdfViewer.html');
    try{
        await readFile(pdfPath, 'utf8');
        const pdfViewer = await readFile(pdfViewerPath, 'utf8');

        const template = hb.compile(pdfViewer, { strict: true });
        const result = template({ pdf:SETTINGS.DOMAIN + SETTINGS.MEDIA_URL + `/pdf/${pdfName}`});

        res.send(result);
    } catch(e){
        throw new CustomError.NotFoundError(`${pdfName} not found .`)
    }
}

module.exports = viewPdf;