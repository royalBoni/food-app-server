const router = require('express').Router()
const couponControl = require('../controllers/couponController')

router.get('/:code', couponControl.fetchCoupon)
router.post('/', couponControl.createCoupon)
router.delete('/:userId/:couponId', couponControl.deleteCoupon)


module.exports=router