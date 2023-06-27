const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    dishName:{
        type:String,
        required:true
    },
    dishId:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    discount:{
        type:Number
    },
    customerId:{
        type:String,
        required:true
    },
    date:{
        type:String
    }
})


module.exports=mongoose.model('order',orderSchema)