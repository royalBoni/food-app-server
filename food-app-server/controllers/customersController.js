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
        const findPasswordMatch =await customers.find({customerEmail:req.body.email});
        if(findPasswordMatch.length===0){
          
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

const editCustomerPassword = async(req,res)=>{
    const {currentPassword, newPassword, customerId} = req.body
    if(!currentPassword) return res.status(400).json({data:"current password is required"})
    if(!newPassword) return res.status(400).json({data:"new password is required"})
    if(!customerId) return res.status(400).json({data:"customerId is required"})
    try{
       const isCustomer =await customers.findById(customerId);
        if(isCustomer){
            // authenticate user by password inputed
            const match = await bcrypt.compare(currentPassword, isCustomer.customerPassword);
            if(match){
                const hashedPswd=await bcrypt.hash(newPassword,10)
                await customers.findByIdAndUpdate(customerId,{
                    'customerPassword':hashedPswd 
                },
                    {new:true}
                ) 
                res.status(201).json({data:'password changed'}); 
            }
            else{
                return res.status(401).json({data:'incorrect password'})
            }      
        }
        else{
            return res.status(404).json({data:'user not found'});
        }    
    }
    catch(err){
        return res.status(400).json({err})
    }   
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
    editCustomerPassword,
    deleteCustomer
}