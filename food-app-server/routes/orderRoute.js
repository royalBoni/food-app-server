const router = require('express').Router()
const orderControl = require('../controllers/orderController')


router.get('/:userId', orderControl.fetchOrders)
router.post('/',orderControl.createOrder)
router.delete('/:orderId/:userId', orderControl.deleteOrder)
router.put('/:orderId',orderControl.editOrder)

module.exports=router