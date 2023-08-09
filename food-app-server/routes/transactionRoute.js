const router = require('express').Router()
const transactionControl = require('../controllers/transactionController')
const {verifyCoupon} = require('../middlewares/couponVerifier')

router.post('/', verifyCoupon, transactionControl.createTransaction)
router.get('/:adminId', transactionControl.fetchAllTransactions)
router.get('/:adminId', transactionControl.fetchAllTransactions)
router.get('/customer/:customerId', transactionControl.fetchCustomerTransaction)

module.exports=router