const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const customerSchema= new Schema({
    customerEmail:{
        type:String,
        required:true
    },
    
    customerPassword:{
        type:String,
        required:true
    },
    
    date:{
        type:String
    }

})

module.exports=mongoose.model('customer', customerSchema);