const mongoose=require('mongoose');
const cloudinary=require('../config/cloudinary')
const dishes = require('../model/dishModel')

const createDish=async(req,res)=>{
    const {dishName,price,catchPhrase,date,description,discount,classification,categories}=req.body;

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
                'category':categories
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


/* const deleteInspiration=async(req,res)=>{
    const{inspirationID,userID}=req.params;
    if(!inspirationID)return res.status(400).json({'message':'inspiration id is required'})
    if(!userID)return res.status(400).json({'message':'user id is required'})
        try{

        // checkimg whether inspiration provided is valid
        if(!mongoose.Types.ObjectId.isValid(inspirationID)) return res.status(400).json({'message':'invalid id'})

        //find user
        const findInspiration=await dishes.findById(inspirationID);
        

        //checking whether there was a match.
        if(!findInspiration){
            return res.status(404).json({'message':`no inspiration matches id ${inspirationID}`})
        }

        else{
            if(findInspiration.authorID===userID){
                //delete previous image from image cloud server when there is a mapping from the database
                findInspiration.inspiration_image_id? await cloudinary.uploader.destroy(findInspiration.inspiration_image_id):null;

                //deleting user from database
                await dishes.deleteOne({_id:inspirationID});
                        
                res.status(201).json({'message':`user with ${inspirationID} have been deleted`})
            }
            else{
                return res.status(401).json({'message':`unauthorized to delete`})
            }
        }
       
        }
        catch(err){
            console.log(err)
        }
}
 */
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
    if(!dishId)return res.status(400).json({'message':'id is required'})

    // checkimg whether user provided id is valid
    if(!mongoose.Types.ObjectId.isValid(dishId)) return res.status(400).send('invalid id')

    //find user
    const findDish=await dishes.findById(dishId);
    
    //checking whether there was a match.
    if(!findDish){
    return res.status(404).json({'message':`no dish matches id ${dishId}`})
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
        
        console.log(dbResult)
            
    res.status(201).json({dbResult})
    }
    catch(err){
        console.log(err)
    }

}

module.exports={
    editDish,
    createDish,
    fetchDishes
}