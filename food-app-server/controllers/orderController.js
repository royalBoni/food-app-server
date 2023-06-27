const orders = require('../model/orderModel')
const mongoose = require('mongoose')

const createOrder=async(req,res)=>{
    const {dishName,customerId,date,price,quantity,discount,dishId}=req.body;
    const dataValidation = [ dishName,customerId,date,price,quantity,discount,dishId].every(Boolean)
    /* if(dataValidation){
        try{
            const newOrder= await orders.create(
                {
                    'dishName':dishName,
                    'customerId':customerId,
                    'date':date,
                    'price':price,
                    'quantity':quantity,
                    'discount':discount,
                    'dishId':dishId
                }
            )
            return res.status(200).json({
                data:newOrder
        });
       }
       catch(err){
           console.log(err)
       }
    }
    else{
        console.log('there are some data missing')
    }
 */
   try{
        const newOrder= await orders.create(
            {
                'dishName':dishName,
                'customerId':customerId,
                'date':date,
                'price':price,
                'quantity':quantity,
                'discount':discount,
                'dishId':dishId
            }
        )
        return res.status(200).json({
            data:newOrder
    });
   }
   catch(err){
       console.log(err)
   } 
}


const deleteOrder=async(req,res)=>{
    const{orderId,userId}=req.params;
    if(!orderId)return res.status(400).json({data:'order id is required'})
    if(!userId)return res.status(400).json({data:'order id is required'})
        try{

        // checkimg whether order Id provided is valid
        if(!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).json({data:'invalid id'})

        //checking whether a order matched the order ID
        const findOrder=await orders.findById(orderId);
        

        //conditions incase there was a match or not
        if(!findOrder){
            return res.status(404).json({data:`no order matches id ${orderId}`})
        }

        else{
            if(findOrder.customerId===userId){
                //deleting user from database
                await orders.deleteOne({_id:orderId});
                        
                res.status(201).json({data:`order with ${orderId} have been deleted`})
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


const fetchOrders=async(req,res)=>{
    const {userId} = req.params
    if(!userId) res.status(400).json({data:'user id is required'}) 

    try{
        // checkimg whether order Id provided is valid
       if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({data:'invalid id'}) 
        const fetchedResult=await orders.find({customerId:userId});
        return res.status(200).json({data:fetchedResult})
        
    }
    catch(err){
        console.log(err)
    }

}

const editOrder=async(req,res)=>{
    const {orderId}=req.params;
    const {quantity}=req.body;
    
    try{
        if(!orderId)return res.status(400).json({'message':'id is required'})

        // checkimg whether order provided id is valid
        if(!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).send('invalid id')

        //find order
        const findOrder=await orders.findById(orderId);
        
       //checking whether there was a match.
        if(!findOrder){
        return res.status(404).json({'message':`no dish matches id ${orderId}`})
        }
        
            //update 
        const dbResult=await orders.findByIdAndUpdate(findOrder._id,{
                'quantity':quantity,
                
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
    createOrder,
    fetchOrders,
    deleteOrder,
    editOrder
}