const customers = require('../model/customerModel')
const bcrypt = require('bcrypt')
const admin = require('../model/adminModel')
const mongoose = require('mongoose')


const fetchAllCustomers = async(req,res)=>{
    const {adminId} = req.params
    if(!adminId) return res.status(400).json({data:'admin Id is required'})
    if(!mongoose.Types.ObjectId.isValid(adminId)) return res.status(400).json({data:'id is invalid'})
    try{
        const isAdmin = await admin.findById(adminId)
        if(isAdmin){
            const fetchedResult=await customers.find();

            return res.status(200).json({data:fetchedResult})
        }
        else{
          return res.status(401).json({data:'unauthorized request'})
        }
        
    }
    catch(err){
        console.log(err)
    }
  
  }
  

const createCustomer = async(req,res)=>{
    const {email,password,date}=req.body;
    if(!email) return res.status(400).json({data:"email is required"})
    if(!password) return res.status(400).json({data:"password is required"})
    try{
        const findEmail =await customers.find({customerEmail:req.body.email});
        if(findEmail.length===0){
          
            const hashedPswd=await bcrypt.hash(password,10)
            const newCustomer =customers.create(
                {
                    'customerEmail':email,
                    'customerPassword':hashedPswd,
                    'date':date
                }
                )
            return res.status(201).json({data:newCustomer});
        }
        else{
            return res.status(401).json({data:'email already used'});
        }    
    }
    catch(err){
        return res.status(400).json({err})
    }   
}

const editCustomer = async(req,res)=>{
    const {id} = req.params
    res.status(200).json({data:`we are about to edit a Customer with ${id}`})
}

const deleteCustomer = async(req,res)=>{
    const {id} = req.params
    res.status(200).json({data:`we are about to delete a Customer with ${id}`})
}

const loginCustomer = async(req,res)=>{
    const{email, password}=req.body;
    if(!email || !password)return res.status(400).json({'message':'email and password are required'})
    
    const findCustomer =await customers.find({customerEmail:email});
    /* if(!findCustomer)return res.status(401).send("user name doesnt match"); */  //unauthorised
    if(findCustomer.length>0){
        const findPass=await findCustomer.find((item)=>item.customerEmail===email);
        const match = await bcrypt.compare(password, findPass.customerPassword);
        if(match){
        return res.status(200).json({data:findPass._id})
    }

        else{
        return res.status(401).json({data:'incorrect password'})
        } 
        
    }
    else{
        return res.status(401).json({data:'email doesnt match any account'})
    }
}


module.exports={
    loginCustomer,
    fetchAllCustomers,
    createCustomer,
    editCustomer,
    deleteCustomer
}