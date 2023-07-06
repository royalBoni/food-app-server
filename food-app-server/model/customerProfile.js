const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerProfileSchema = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    gender:{
        type:String
    },
    customerId:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("customerProfile",customerProfileSchema)