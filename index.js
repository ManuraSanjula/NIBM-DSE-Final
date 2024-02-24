const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.config.env' });
const DB = process.env.DATABASE;
process.env.UV_THREADPOOL_SIZE = 25;
const cookieParser = require('cookie-parser');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
var cors = require ('cors')

const ClothRoute = require('./Routes/All/ClothRoute');
const userRouter = require('./Routes/All/UserRoute');
const reviewRouter = require('./Routes/Customer/ReviewRoute');
const cartRouter = require('./Routes/Customer/CartRoute');
const orderRouter = require('./Routes/Customer/OrderRoute');
const companyRouter = require('./Routes/Company/CompanyRoute')
const homeRoute = require('./Routes/All/UIRoute')

const init = () => {
    
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    app.use(cookieParser());
    app.use (cors())

    app.use(express.json({ limit: '4000kb' }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(__dirname));

    app.use(function (error, req, res, next) {
        if (error.message === "invalid json") {
            return res.status(404).json({
                status: 'failed',
                message: 'Json'
            })
        } else {
            next();
        }
    });
    app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use('/',homeRoute)
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/shop', ClothRoute);
    app.use('/api/v1/shop/Cloth/review', reviewRouter);
    app.use('/api/v1/user/cart', cartRouter);
    app.use('/api/v1/user/order', orderRouter);
    app.use('/api/v1', companyRouter);


    app.use((req, res, next) => {
        return res.status(404).json({
            status: 'failed',
            message: 'not Found'
        })
    })

    app.all('*', (req, res, next) => {
         res.render('error')
    });

    mongoose
        .connect(DB)
        .then(() => {
            console.log('\x1b[36m%s\x1b[0m', 'Mongo DB Live')
        });



    const server = app.listen(port, () => console.log('\x1b[35m%s\x1b[0m', `app listening on ${port} port!`))


    process.on('uncaughtException', err => {
        console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        process.exit(1);
    });

    process.on('unhandledRejection', err => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        console.log(err);
        server.close(() => {
            process.exit(1);
        });
    });


}

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
} else {
    init();
}


