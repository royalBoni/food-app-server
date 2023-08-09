const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    customerId:{
        type:String,
        required:true
    },
    modeOfPayment:{
        type:String,
        required:true
    },
    amountPayable:{
        type:Number,
        required:true
    },
    couponCode:{
        type:String
    },
    couponRate:{
        type:Number
    },
    transactionId:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    cartItems:{
        type:Array,
    },
    purchaseStatus:{
        type:String
    },
    purchaseStatusDate:{
        type:String
    }
})


module.exports=mongoose.model('transaction', transactionSchema)