const router = require('express').Router()
const transactionControl = require('../controllers/transactionController')
const {verifyCoupon} = require('../middlewares/couponVerifier')

router.post('/', verifyCoupon, transactionControl.createTransaction)
router.get('/:adminId', transactionControl.fetchAllTransactions)

module.exports=router