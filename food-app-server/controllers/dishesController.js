const mongoose=require('mongoose');
const cloudinary=require('../config/cloudinary')
const dishes = require('../model/dishModel')
const admins = require('../model/adminModel')

const createDish=async(req,res)=>{
    const {dishName,price,catchPhrase,date,description,discount,classification,category}=req.body;

   try{
        const response={secure_url:'',public_id:''}
        const result= !req.file? response: await cloudinary.uploader.upload(req.file.path);
        const newDish= await dishes.create(
            {
                'dishName':dishName,
                'price':price,
                'catchPhrase':catchPhrase,
                'date':date,
                'description':description,
                'dish_image_url':result.secure_url,
                'dish_image_id':result.public_id,
                'discount':discount,
                'classification':classification,
                'category':category
            }
        )
        return res.status(200).json({
            data:newDish
    });
   }
   catch(err){
       console.log(err)
   } 
}

const deleteDish=async(req,res)=>{
    const{dishId,adminId}=req.params;
    if(!dishId)return res.status(400).json({data:'dish id is required'})
    if(!adminId)return res.status(400).json({data:'admin id is required'})
        try{

            // checking whether id provided is valid
            if(!mongoose.Types.ObjectId.isValid(dishId)) return res.status(400).json({data:'invalid dish id'})
            if(!mongoose.Types.ObjectId.isValid(adminId)) return res.status(400).json({data:'invalid admin id'})

            //check whether admin is authorized to delete 
            const findAdmin = await admins.findById(adminId)
            if(findAdmin){
                // deletion process after admin authorization is true
                //find dish
                const findDish=await dishes.findById(dishId);
                

                //checking whether there was a match.
                if(!findDish){
                    return res.status(404).json({data:`no dish matches id ${dishId}`})
                }

                else{
                    //delete previous image from image cloud server when there is a mapping from the database
                    findDish.dish_image_id? await cloudinary.uploader.destroy(findDish.dish_image_id):null;

                    //deleting user from database
                    await dishes.deleteOne({_id:dishId});
                              
                    res.status(201).json({data:`user with ${dishId} have been deleted`})
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

const fetchDishes=async(req,res)=>{
    try{
        const fetchedResult=await dishes.find();
        return res.status(200).json({data:fetchedResult})
    }
    catch(err){
        console.log(err)
    }

}


const editDish=async(req,res)=>{
    const {dishName,price,catchPhrase,date,description,discount,classification,categories,dishId}=req.body;
    
    try{
    if(!dishId)return res.status(400).json({data:'id is required'})

    // checkimg whether user provided id is valid
    if(!mongoose.Types.ObjectId.isValid(dishId)) return res.status(400).send('invalid id')

    //find user
    const findDish=await dishes.findById(dishId);
    
    //checking whether there was a match.
    if(!findDish){
    return res.status(404).json({data:`no dish matches id ${dishId}`})
    }

    const response={secure_url:findDish.dish_image_url,public_id:findDish.dish_image_id}

    //delete previous image from image cloud server
    req.file? (findDish.dish_image_id? await cloudinary.uploader.destroy(findDish.dish_image_id):null):null;
    
    //uploading the updated image to the cloud server
    const result= !req.file? response: await cloudinary.uploader.upload(req.file.path);
        //update and store the new image
       const dbResult=await dishes.findByIdAndUpdate(findDish._id,{
                'dishName':dishName,
                'price':price,
                'catchPhrase':catchPhrase,
                'date':date,
                'description':description,
                'dish_image_url':result.secure_url,
                'dish_image_id':result.public_id,
                'discount':discount,
                'classification':classification,
                'category':categories
            
        },
            {new:true}
        )
            
    res.status(201).json({dbResult})
    }
    catch(err){
        console.log(err)
    }

}

module.exports={
    editDish,
    createDish,
    fetchDishes,
    deleteDish
}