const mobileMoneyPaymentOperation = (item)=>{
    console.log('we are paying through mobile money')
         /* paymentControl.mobileMoneyPaymentOperation(paymentInfoObject)
        return res.set('Access-Control-Allow-Origin', '*').redirect("localhost:3000/"); */

        const user = '76e2801f-b9d4-4e98-b4dd-420416fe61d2';
        const password = 'ce42b6325b1448098582cdc3ab85a8a0';

        const base64encodedData = Buffer.from(user + ':' + password).toString('base64');
        console.log(base64encodedData)
        
        const options = {
          hostname: 'sandbox.momodeveloper.mtn.com',
          path: '/collection/token/',
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + base64encodedData,
            'Content-Type': 'application/json',
            'X-Reference-Id':'123456789',
            'Ocp-Apim-Subscription-Key':'0cb50dd7bf3b46919d6506cbf12779d2'
          }
        };
        
        const request = https.request(options, (result) => {
          console.log(`statusCode: ${result.statusCode}`);
          console.log(result)
          /* result.on('data', (d) => {
            return res.status(201).json({data:`order with ${d.access_token} have been deleted`})
          });  */
        });
        
        request.on('error', (error) => {
          console.error(error);
        });
        
        request.end();
}

const bankCardPaymentOperation = () =>{
    console.log('we are paying through bank card')
}

const cryptoPaymentOperation = () =>{
    console.log('we are paying through crypto')
}

const paypalPaymentOperation = () =>{
    console.log('we are paying through paypal')
}


module.exports={
    mobileMoneyPaymentOperation,
    bankCardPaymentOperation,
    cryptoPaymentOperation,
    paypalPaymentOperation
}