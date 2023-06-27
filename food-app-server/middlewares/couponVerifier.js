const coupons = require('../model/coupon')

const verifyCoupon=async(req,res,next)=>{
    const {paymentInfoObject}=req.body
    if(paymentInfoObject.couponRate>0){
        const isCouponValid = await coupons.findOne({code:paymentInfoObject.couponInput})
        if(isCouponValid){
            next();
        }
        else{
            res.json({data:'coupon already used'})
        }
    }
    else{
        next()
    }
    
        
}

module.exports={verifyCoupon}