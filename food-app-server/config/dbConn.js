const mongoose=require('mongoose');
const path = require('path')

require('dotenv').config({path:path.join(__dirname,'..','.env')});

const connectDB =async ()=>{
    try{
        mongoose.set('strictQuery',false);
        await mongoose.connect(process.env.DATABASE_CONNECTION_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
    }

    catch(err){
        console.log(err)
    }
}

module.exports=connectDB