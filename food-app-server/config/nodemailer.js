const {EMAIL,PASSWORD}=require('../env')



let config={
    service: "gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
    },
  }

  module.exports=config