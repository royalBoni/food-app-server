const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const newsletterSubscribers = require('../model/newsLetterSubscribers')

let config={
    service: "gmail",
    auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD
    },
} 
    // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(config);

const subscribeNewsletter = async(req,res)=>{
    const {email} = req.body
    console.log(email)
    if(!email) return res.status(400).json({data:"email is required"})
    try{
        const isAlreadySubscribed = await newsletterSubscribers.findOne({email:email})
        if(isAlreadySubscribed){
        res.status(409).json({data:"already subscribed"})
        }
        else{
        const subscriberName= email.split("@")

        await newsletterSubscribers.create({
                "email":email
            }).then((newSubscriber)=>{ 
                let confirmationMessage={
                    from:process.env.EMAIL,
                    to:email,
                    subject:"Newsletter Subscription",
                    html:`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>HTTP SERVER</title>
                    
                        <style>
                            span{
                                color:rgb(241, 110, 23)
                            }
                            .email{
                                padding: 1rem;
                                background-color:rgba(235, 215, 201, 0.678); 
                            }
                            h1{  
                                color: rgb(63, 4, 50);
                                font-style: italic;
                            }
                    
                            .greetings{
                                display: grid;
                                gap: 0.5rem;
                            }
                            button{
                                background-color:rgb(241, 110, 23);
                                border:1px solid rgb(241, 110, 23);
                                border-radius:8px;
                                cursor:pointer;
                                color:whitesmoke;
                            }
                            a{
                                color:whitesmoke;
                                text-decoration:none;
                                font-weight:bold
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email">
                            <h1>Royal<span>Food</span></h1>
                            <h4>Hello ${subscriberName[0]},</h4>
                            <p>
                                This email confirms that we have recieved your subscription for our newsletters. The RoyalFood TEAM will be providing you with interesting and good
                                contents.
                                Incase of new products, the inspire TEAM will contact you about it.
                            </p>
                            <p>
                                You can unsubscribe to this service by clicking on the unsubscribe button 
                                <button><a href=http://localhost:3000/unsubscribe/${newSubscriber._id}>Unsubscribe</button>
                            </p>
                            <p class="greetings">
                                <p>Regards,</p>
                                <p>The Royal<span>Food</span> Team</p>
                                <p>${new Date()}</p>
                            </p>
                    
                        </div>
                        
                        
                    </body>
                    </html>
                    
                `}
                
                transporter.sendMail(confirmationMessage).then(()=>{
                    return res.status(201).json({
                        data:'Subscribed successfuly. A confirmation have been sent to your email'
                    })
                }).catch(error=>{
                    return res.status(500).json({error})
                })
                
            })   
        } 
    
    }
    catch(error){
        console.log(error)
    }
}

const unSubscribeNewsletter = async(req,res)=>{
    const {id} = req.params
    if(!id) return res.status(400).json({data:"id is required"})
    const isAlreadyUnsubscribed = await newsletterSubscribers.findById(id)
    if(isAlreadyUnsubscribed){
        const subscriberName= isAlreadyUnsubscribed.email.split("@")
        await newsletterSubscribers.findByIdAndDelete(id).then(()=>{
            let confirmationMessage={
                from:process.env.EMAIL,
                to:isAlreadyUnsubscribed.email,
                subject:"Newsletter Unsubscription",
                html:`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>HTTP SERVER</title>
                
                    <style>
                        span{
                            color:rgb(241, 110, 23)
                        }
                        .email{
                            padding: 1rem;
                            background-color:rgba(235, 215, 201, 0.678); 
                        }
                        h1{  
                            color: rgb(63, 4, 50);
                            font-style: italic;
                        }
                
                        .greetings{
                            display: grid;
                            gap: 0.5rem;
                        }
                        button{
                            background-color:rgb(241, 110, 23);
                            border:1px solid rgb(241, 110, 23);
                            border-radius:8px;
                            cursor:pointer;
                            color:whitesmoke;
                        }
                        a{
                            color:whitesmoke;
                            text-decoration:none;
                            font-weight:bold
                        }
                    </style>
                </head>
                <body>
                    <div class="email">
                        <h1>Royal<span>Food</span></h1>
                        <h4>Hello ${subscriberName[0]},</h4>
                        <p>
                            This email confirms that your request to unsubscribe from our newsletter services have been recieved and processed.
    
                            Incase of a any incoveniences,questions,recomendations and many more, you can reach out to the RoyalFood Team through this 
                            link <a href=http://localhost:3000/contact/>contact us<a/>.
                        </p>
                        <p class="greetings">
                            <p>Regards,</p>
                            <p>The Royal<span>Food</span> Team</p>
                            <p>${new Date()}</p>
                        </p>
                
                    </div>
                    
                    
                </body>
                </html>
                
            `}
            
            transporter.sendMail(confirmationMessage).then(()=>{
                return res.status(200).json({
                    data:'Unsubscribed successfuly. A confirmation have been sent to your email'
                })
            }).catch(error=>{
                return res.status(500).json({error})
            })
        })
    }
    else{
        res.status(200).json({data:"already unsubscribed"})
    }
   
    
}

const checkNewsletterSubscription = async (req,res)=>{
    const {email}= req.params
    
    try{
        const isAlreadySubscribed = await newsletterSubscribers.findOne({email:email})
        if(isAlreadySubscribed){
            res.status(200).json({data:"subscribed"})
        }
        else{
            res.status(401).json({data:"not subscribed"})
        }
    }
    catch(err){
        console.log(err)
    }
}

module.exports={
    subscribeNewsletter,
    unSubscribeNewsletter,
    checkNewsletterSubscription
}