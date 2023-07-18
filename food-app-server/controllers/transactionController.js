const paymentControl = require('../paymentApi/paymentApi')
const https = require('https')
const path = require('path')
const {nanoid} = require('nanoid')
const momo = require("mtn-momo");
const transactions = require('../model/transaction')
const coupons = require('../model/coupon')
const orders = require('../model/orderModel');
const admin = require('../model/adminModel')
const mongoose = require('mongoose')

require('dotenv').config({path:path.join(__dirname,'..','.env')});


const fetchAllTransactions = async(req,res)=>{
  const {adminId} = req.params
  if(!adminId) return res.status(400).json({data:'admin Id is required'})
  if(!mongoose.Types.ObjectId.isValid(adminId)) return res.status(400).json({data:'id is invalid'})
  try{
      const isAdmin = await admin.findById(adminId)
      if(isAdmin){
        const fetchedResult=await transactions.find();
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


const createTransaction = async(req,res)=>{
    const {paymentInfoObject,date}=req.body
    let transactionID

    const cartItemArray=(item)=>{
      let itemList =[];
      item.map((mappedItem)=>{
        /* const mappedItemObject= {dishId:mappedItem.dishId, quantity:mappedItem.quantity,discount:mappedItem.discount,orderId:mappedItem._id} */
        itemList.push(mappedItem)
        return true
      })
      return itemList
    }

    if(paymentInfoObject.modeOfPaymentInput==="MobileMoney"){
      const { Collections } = momo.create({
        callbackHost: process.env.CALLBACK_HOST
      });
      
      const collections = Collections({
        userSecret: process.env.COLLECTIONS_USER_SECRET,
        userId: process.env.COLLECTIONS_USER_ID,
        primaryKey: process.env.COLLECTIONS_PRIMARY_KEY
      });
      
      // Request to pay
      collections
        .requestToPay({
          amount: paymentInfoObject.amountPayable,
          currency: "EUR",
          externalId: nanoid(10),
          payer: {
            partyIdType: "MSISDN",
            partyId: paymentInfoObject.phoneInput
          },
          payerMessage: "Payment of purchase from RoyalFood",
          payeeNote: "Making Payment"
        })
        .then(transactionId => {
          /* console.log({ transactionId }); */
          transactionID= transactionId
      
          // Get transaction status
          return collections.getTransaction(transactionId);
        })
        .then( async transaction => {
          if(transaction.status==='SUCCESSFUL'){
            transactions.create(
              {
                  'customerId':paymentInfoObject.customerId,
                  'modeOfPayment':paymentInfoObject.modeOfPaymentInput,
                  'amountPayable':paymentInfoObject.amountPayable,
                  'date':new Date(),
                  'couponCode':paymentInfoObject.couponInput,
                  'couponRate':paymentInfoObject.couponRate,
                  'transactionId':transactionID,
                  'cartItems':cartItemArray(await orders.find({customerId:paymentInfoObject.customerId}))
              }
          ).then(async savedTransaction=>{
            await coupons.findOneAndDelete({code:savedTransaction.couponCode}).then(async()=>{
              await orders.deleteMany({customerId:paymentInfoObject.customerId})
              res.status(200).json({data: await transactions.findOne({transactionId:transactionID})})
            })
            
          }).catch(error => {
            console.log(error);
          });
          }
          else{
            return res.status(200).json({data:`payment was unsuccessful`})
          }
        })
        .catch(error => {
          console.log(error);
        });
       
    }
    else if(paymentInfoObject.modeOfPaymentInput==="BankCard"){
        return res.status(400).json({data:`payment with ${paymentInfoObject.modeOfPaymentInput} is under construction`})
    }
    else if(paymentInfoObject.modeOfPaymentInput==="Crypto"){
      return res.status(400).json({data:`payment with ${paymentInfoObject.modeOfPaymentInput} is under construction`})
    }
    else if(paymentInfoObject.modeOfPaymentInput==="Paypal"){
      return res.status(400).json({data:`payment with ${paymentInfoObject.modeOfPaymentInput} is under construction`})
    }
}

const fetchCustomerTransaction=async(req,res)=>{
  const {customerId} = req.params
  if(!customerId) res.status(400).json({data:'customer id is required'}) 

  try{
      // checkimg whether order Id provided is valid
     if(!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json({data:'invalid id'}) 
      const fetchedResult=await transactions.find({customerId:customerId});
      return res.status(200).json({data:fetchedResult})
      
  }
  catch(err){
      console.log(err)
  }

}

module.exports={
    fetchAllTransactions,
    createTransaction,
    fetchCustomerTransaction
}