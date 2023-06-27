const mongoose=require('mongoose')
const Schema = mongoose.Schema

const dishSchema = new Schema({
    dishName:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    catchPhrase:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    discount:{
        type:Number
    },
    dish_image_url:{
        type:String
    },
    classification:{
        type:String,
        required:true 
    },

    category:{
        type:Array,
    },
    dish_image_id:{
        type:String
    },
    date:{
        type:String
    }
})

module.exports=mongoose.model('dish', dishSchema)