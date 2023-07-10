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
        type:String
    },
    country:{
        type:String
    },
    phoneNumber:{
        type:String
    }
})

module.exports=mongoose.model("customerProfile",customerProfileSchema)