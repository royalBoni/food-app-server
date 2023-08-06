const dishReviews = require('../model/dishReviewModel')
const mongoose = require('mongoose')

const createDishReview=async(req,res)=>{
    const {userName,userEmail,userId,date,review,dishId,rate}=req.body;

   try{
        const newDishReview= await dishReviews.create(
            {
                'userName':userName,
                'userEmail':userEmail,
                'userId':userId,
                'date':date,
                'review':review,
                'dishId':dishId,
                'rate':rate
            }
        )
        return res.status(200).json({
            data:newDishReview
    });
   }
   catch(err){
       console.log(err)
   }
}


const deleteDishReview=async(req,res)=>{
    const{reviewId,userId}=req.params;
    if(!reviewId)return res.status(400).json({data:'review id is required'})
    if(!userId)return res.status(400).json({data:'user id is required'})
        try{

        // checkimg whether review Id provided is valid
        if(!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).json({data:'invalid id'})

        //checking whether a review matched the review ID
        const findReview=await dishReviews.findById(reviewId);
        

        //conditions incase there was a match or not
        if(!findReview){
            return res.status(404).json({data:`no review matches id ${reviewId}`})
        }

        else{
            if(findReview.userId===userId){
                //deleting user from database
                await dishReviews.deleteOne({_id:reviewId});
                        
                res.status(201).json({data:`review with ${reviewId} have been deleted`})
            }
            else{
                return res.status(401).json({data:`unauthorized to delete`})
            }
        }
       
        }
        catch(err){
            console.log(err)
        }
}

const fetchDishReviewsById=async(req,res)=>{
    const {userId} = req.params
    if(!userId) res.status(400).json({data:'user id is required'}) 

    try{
        // checkimg whether order Id provided is valid
       if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({data:'invalid id'}) 
        const fetchedResult=await dishReviews.find({userId:userId});
        return res.status(200).json({data:fetchedResult})
        
    }
    catch(err){
        console.log(err)
    }

}


const fetchDishReviews=async(req,res)=>{
    try{
        const fetchedResult=await dishReviews.find();
        return res.status(200).json({data:fetchedResult})
    }
    catch(err){
        console.log(err)
    }

}




module.exports={
    createDishReview,
    fetchDishReviews,
    deleteDishReview,
    fetchDishReviewsById
}