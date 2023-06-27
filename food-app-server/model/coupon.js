const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = new Schema({
    code:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    adminId:{
        type:String
    },
    date:{
        type:String
    }
})

module.exports=mongoose.model('coupon',couponSchema)