const coupons = require('../model/coupon')
const mongoose = require('mongoose')
const {nanoid} = require('nanoid')

const createCoupon=async(req,res)=>{
    const {value,adminId}=req.body;
    const code = nanoid()

   try{
        const newCoupon= await coupons.create(
            {
                'code':code,
                'value':value,
                'date':new Date(),
                'adminId':adminId
            }
        )
        return res.status(200).json({
            data:newCoupon
    });
   }
   catch(err){
       console.log(err)
   } 
}


const deleteCoupon=async(req,res)=>{
    const{couponId,adminId}=req.params;
    if(!couponId)return res.status(400).json({data:'coupon id is required'})
    if(!adminId)return res.status(400).json({data:'admin id is required'})
        try{

        // checkimg whether coupon Id provided is valid
        if(!mongoose.Types.ObjectId.isValid(couponId)) return res.status(400).json({data:'invalid id'})

        //checking whether a coupon matched the coupon ID
        const findCoupon=await coupons.findById(couponId);
        

        //conditions incase there was a match or not
        if(!findCoupon){
            return res.status(404).json({data:`no coupon matches id ${couponId}`})
        }

        else{
            if(findCoupon.adminId===adminId){
                //deleting admin from database
                await coupons.deleteOne({_id:couponId});
                        
                res.status(201).json({data:`coupon with ${couponId} have been deleted`})
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


const fetchCoupon=async(req,res)=>{
    const {code} = req.params
    if(!code){
        res.status(400).json({data:'coupon code is required'})
    }
    else{
        try{
            // checking whether code provided is valid
            const fetchedResult=await coupons.findOne({code:code});
            if(fetchedResult){
                return res.status(200).json({data:fetchedResult})
            }
            else{
                return res.status(404).json({data:'code doesnt match any coupon'})
            }      
        }
        catch(err){
            console.log(err)
        }
    
    }

    
}




module.exports={
    createCoupon,
    fetchCoupon,
    deleteCoupon
}