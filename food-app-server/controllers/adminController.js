const admins = require('../model/adminModel')
const bcrypt = require('bcrypt')

const fetchAdmin = async(req,res)=>{
    try{
        const fetchedResult=await admins.find();
        return res.status(200).json({data:fetchedResult})
    }
    catch(err){
        console.log(err)
    }

}

const createAdmin = async(req,res)=>{
    const {email,password,date,firstName,lastName,gender}=req.body;
    if(!email) return res.status(400).json({data:"email is required"})
    if(!password) return res.status(400).json({data:"password is required"})
    try{
        const findEmail =await admins.findOne({email:req.body.email});
        if(!findEmail){
          
            const hashedPswd=await bcrypt.hash(password,10)
            const newAdmin = await admins.create(
                {
                    'email':email,
                    'password':hashedPswd,
                    'date':date,
                    'firstName':firstName,
                    'lastName':lastName,
                    'gender':gender
                }
                )
            return res.status(201).json({data:newAdmin});
        }
        else{
            return res.status(401).json({data:'email already used'});
        }    
    }
    catch(err){
        return res.status(400).json({err})
    }   
}

const editAdmin = async(req,res)=>{
    const {id} = req.params
    res.status(200).json({data:`we are about to edit a Customer with ${id}`})
}

const deleteAdmin = async(req,res)=>{
    const {id} = req.params
    res.status(200).json({data:`we are about to delete a Customer with ${id}`})
}

const loginAdmin = async(req,res)=>{
    const{email, password}=req.body;
    if(!email || !password)return res.status(400).json({'message':'email and password are required'})
    
    const findAdmin =await admins.findOne({email:email});
    /* if(!findAdmin)return res.status(401).send("user name doesnt match"); */  //unauthorised
    if(findAdmin){
        /* const findPass=await findAdmin.find((item)=>item.customerEmail===email); */
        const match = await bcrypt.compare(password, findAdmin.password);
        if(match){
        return res.status(200).json({data:
            {firstName:findAdmin.firstName,gender:findAdmin.gender,id:findAdmin._id,date:findAdmin.date,lastName:findAdmin.lastName}
        })
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
    loginAdmin,
    fetchAdmin,
    createAdmin,
    editAdmin,
    deleteAdmin
}