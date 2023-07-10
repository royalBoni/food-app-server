const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerAddressSchema = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    additionalPhoneNumber:{
        type:String
    },
    address:{
        type:String
    },
    additionalInfo:{
        type:String
    },
    region:{
        type:String
    },
    city:{
        type:String
    },
    customerId:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("customerAddress",customerAddressSchema)