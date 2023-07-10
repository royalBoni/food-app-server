const mongoose=require('mongoose');
const cloudinary=require('../config/cloudinary')
const profiles = require('../model/customerProfile')
const customers = require('../model/customerModel')

const createProfile=async(req,res)=>{
    const {firstName,lastName, gender,customerId,country,phoneNumber}=req.body;
    if(!customerId)return res.status(400).json({data:'customer id is required'})

    try{
        const newProfile= await profiles.create(
            {
                'firstName':firstName,
                'lastName':lastName,
                'gender':gender,
                'customerId':customerId,
                'country':country,
                'phoneNumber':phoneNumber
            }
        )
        return res.status(200).json({
            data:newProfile
    });
   }
   catch(err){
       console.log(err)
   } 
}

const deleteProfile=async(req,res)=>{
    const{profileId, customerId}=req.params;
    if(!profileId)return res.status(400).json({data:'profile id is required'})
    if(!customerId)return res.status(400).json({data:'customer id is required'})
        try{
            // checking whether id provided is valid
            if(!mongoose.Types.ObjectId.isValid(profileId)) return res.status(400).json({data:'invalid profile id'})
            if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json({data:'invalid customer id'})

            //check whether customer is authorized to delete 
            const findCustomer = await customers.findById(customerId)
            if(findCustomer){
                // deletion process after customer authorization is true
                //find profile
                const findProfile=await profiles.findById(profileId);
                

                //checking whether there was a match.
                if(!findProfile){
                    return res.status(404).json({data:`no profile matches id ${profileId}`})
                }

                else{
                    //deleting user from database
                    await profiles.deleteOne({_id:profileId});
                              
                    res.status(201).json({data:`profile with ${profileId} have been deleted`})
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

const fetchProfiles=async(req,res)=>{
    try{
        const fetchedResult=await profiles.find();
        return res.status(200).json({data:fetchedResult})
    }
    catch(err){
        console.log(err)
    }

}

const fetchCustomerProfile=async(req,res)=>{

    const{customerId}=req.params;
    if(!customerId)return res.status(400).json({data:'customer id is required'})

    try{
        if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json({data:'invalid customer id'})
        const fetchedResult=await profiles.findOne({customerId:customerId});
        if(fetchedResult){
            return res.status(200).json({data:fetchedResult})
        }
        else{
            return res.status(404).json({data:`no customer matches id ${profileId}`})
        }
        
    }
    catch(err){
        console.log(err)
    }
}



const editProfile=async(req,res)=>{
    const {firstName,lastName, gender,customerId,profileId,country,phoneNumber}=req.body;
    if(!customerId)return res.status(400).json({data:'customer id is required'})
    if(!profileId)return res.status(400).json({data:'profile id is required'})
    try{
        // checking whether ids provided are valid
        if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).send('invalid customer id')
        if(!mongoose.Types.ObjectId.isValid(profileId)) return res.status(400).send('invalid profile id')

        //checking for authorization for carrying out operation
        const isAuthorized = await customers.findById(customerId)

        if(isAuthorized){
            //find profile
            const findProfile=await profiles.findById(profileId);
            
            //checking whether there was a match.
            if(!findProfile){
                return res.status(404).json({data:`no profile matches id ${profileId}`})
            }
            
            //update 
            const dbResult=await profiles.findByIdAndUpdate(profileId,{
                'firstName':firstName,
                'lastName':lastName,
                'gender':gender,
                'customerId':customerId,
                'country':country,
                'phoneNumber':phoneNumber
                    
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

module.exports={
    editProfile,
    createProfile,
    fetchProfiles,
    deleteProfile,
    fetchCustomerProfile
}