const express =require('express');
const app =express()
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB =require('./config/dbConn');
const mongoose=require('mongoose');
const path = require('path')
const PORT = process.env.PORT||5000;

require('dotenv').config({path:path.join(__dirname,'..','.env')});

connectDB()

//middleware to get data from parsed json
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json()) 

app.use('/dishes', require('./routes/dishesRoute'))
app.use('/customers', require('./routes/customersRoute'))
app.use('/reviews',require('./routes/dishReviewsRoute'))
app.use('/order', require('./routes/orderRoute'))
app.use('/coupon', require('./routes/couponRoute'))
app.use('/transaction', require('./routes/transactionRoute'))
app.use('/newsletter', require('./routes/newsletterRoute'))
app.use('/admin', require('./routes/adminRoute'))
app.use('/profile', require('./routes/customerProfile'))
app.use('/address', require('./routes/customerAddressRoute'))

mongoose.connection.once("open",()=>{
    console.log("connected to mongodb");
    app.listen(PORT,()=>{
        console.log(`the server is running on PORT ${PORT}`)
    })
})