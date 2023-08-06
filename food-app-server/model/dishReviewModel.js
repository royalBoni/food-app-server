const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dishReviewSchema = new Schema({
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    userEmail:{
        type:String
    },
    review:{
        type:String
    },
    rate:{
        type:Number
    },
    date:{
        type:String
    },
    dishId:{
        type:String,
        required:true
    }

})


module.exports=mongoose.model('dishReview',dishReviewSchema)