const mongoose=require('mongoose');
const cloudinary=require('../config/cloudinary')
const addresses = require('../model/customerAddressModel')
const customers = require('../model/customerModel')
const admin = require('../model/adminModel')

const createAddress=async(req,res)=>{
    const {firstName, lastName, phoneNumber, additionalPhoneNumber,address,additionalInfo,region,city,customerId}=req.body;
    if(!customerId)return res.status(400).json({data:'customer id is required'})

    try{
        const newAddress= await addresses.create(
            {
                'firstName':firstName,
                'lastName':lastName,
                'address':address,
                'customerId':customerId,
                'region':region,
                'city':city,
                'additionalInfo':additionalInfo,
                'phoneNumber':phoneNumber,
                'additionalPhoneNumber':additionalPhoneNumber
            }
        )
        return res.status(200).json({
            data:newAddress
    });
   }
   catch(err){
       console.log(err)
   } 
}

const deleteAddress=async(req,res)=>{
    const{addressId, customerId}=req.params;
    if(!addressId)return res.status(400).json({data:'address id is required'})
    if(!customerId)return res.status(400).json({data:'customer id is required'})
        try{
            // checking whether id provided is valid
            if(!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).json({data:'invalid address id'})
            if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json({data:'invalid customer id'})

            //check whether customer is authorized to delete 
            const findCustomer = await customers.findById(customerId)
            if(findCustomer){
                // deletion process after customer authorization is true
                //find profile
                const findAddress=await addresses.findById(addressId);
                

                //checking whether there was a match.
                if(!findAddress){
                    return res.status(404).json({data:`no address matches id ${addressId}`})
                }

                else{
                    //deleting user from database
                    await addresses.deleteOne({_id:addressId});
                              
                    res.status(201).json({data:`address with ${addressId} have been deleted`})
                }
        
            }

            else{
                return res.status(404).json({data:`unauthorize for this operation`})
            }

        
        }
        catch(err){
            console.log(err)
        }
}

const fetchAllAddress=async(req,res)=>{
    const{customerId}=req.params;
    if(!customerId)return res.status(400).json({data:'customer id is required'})
    try{
        const fetchedResult=await addresses.find({customerId:customerId});
        if(fetchedResult.length>0){
            return res.status(200).json({data:fetchedResult})
        }
        else{
            return res.status(405).json({data:'no address found'})
        }
        
    }
    catch(err){
        console.log(err)
    }

}


const editAddress=async(req,res)=>{
    const {firstName, lastName, phoneNumber, additionalPhoneNumber,address,additionalInfo,region,city,customerId,addressId}=req.body;
    if(!customerId)return res.status(400).json({data:'customer id is required'})
    if(!addressId)return res.status(400).json({data:'address id is required'})
    try{
        // checking whether ids provided are valid
        if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).send('invalid customer id')
        if(!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).send('invalid address id')

        //checking for authorization for carrying out operation
        const isAuthorized = await customers.findById(customerId)

        if(isAuthorized){
            //find profile
            const findAddress=await addresses.findById(addressId);
            
            //checking whether there was a match.
            if(!findAddress){
                return res.status(404).json({data:`no address matches id ${addressId}`})
            }
            
            //update 
            const dbResult=await addresses.findByIdAndUpdate(addressId,{
                'firstName':firstName,
                'lastName':lastName,
                'address':address,
                'customerId':customerId,
                'region':region,
                'city':city,
                'additionalInfo':additionalInfo,
                'phoneNumber':phoneNumber,
                'additionalPhoneNumber':additionalPhoneNumber
                    
            },
                    {new:true}
                )
                    
            res.status(201).json({dbResult})
                
        }
        else{
            return res.status(404).json({data:`unauthorize for this operation`})
        }
    }
    catch(err){
        console.log(err)
    }

}

const fetchAdminAllAddress = async(req,res)=>{
    const {adminId} = req.params
    if(!adminId) return res.status(400).json({data:'admin Id is required'})
    if(!mongoose.Types.ObjectId.isValid(adminId)) return res.status(400).json({data:'id is invalid'})
    try{
        const isAdmin = await admin.findById(adminId)
        if(isAdmin){
          const fetchedResult=await addresses.find();
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

module.exports={
    editAddress,
    createAddress,
    fetchAllAddress,
    deleteAddress,
    fetchAdminAllAddress
}