require('dotenv').config();
require('express-async-errors');
const path = require('path');

// settings
const SETTINGS = require('./settings');

//socket auth middleware
const { authenticateUser } = require('./sockets/authentication');

// extra packages
const cors = require('cors'); 

// socket io
const socketIO = require('socket.io');

// express
const express = require('express');
const app = express();
const server = require('http').createServer(app);

// db connection
const connectDB = require('./db/connect');

// extra packages 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// routers
const userRouter = require('./user/routes');
const menuRouter = require('./menu/menuRoutes');
const orderRouter = require('./order/orderRoutes');
const tableRouter = require('./order/tableRoutes');
const billRouter = require('./bill/billRoutes');
const adminRouter = require('./admin/adminRoutes');
const viewPdf = require('./pdf-viewer/controllers');


// middlewares 
const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFoundMiddleware = require('./middlewares/not-found');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));


app.use('/api/v1/users', userRouter);
app.use('/api/v1/menu',menuRouter);
app.use('/api/v1/order',orderRouter);
app.use('/api/v1/table',tableRouter);
app.use('/api/v1/bill',billRouter);

app.use('/admin', adminRouter);
app.get(`${SETTINGS.MEDIA_URL}/view/pdf/:pdfName`, viewPdf);
app.use(SETTINGS.MEDIA_URL, express.static(SETTINGS.MEDIA_ROOT))
app.use(SETTINGS.STATIC_URL, express.static(SETTINGS.STATIC_ROOT))
app.get('/*', async (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
    console.log(req.ip);
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// socket 
const io = socketIO(server);
io.use((socket, next) => authenticateUser(socket, socket.request, {}, next));
require('./sockets/orderSocket')(io);

// server 
const PORT = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        server.listen(PORT, ipAddress=process.env.SERVER_IP || 'localhost', () => {
            console.log(`Server is listening on port : ${PORT} ...`);
            console.log(`http://${ipAddress}:${PORT}`);
        })
    } catch (err) {
        console.log(err);
    }
}
start();