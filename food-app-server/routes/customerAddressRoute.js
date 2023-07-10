const router = require('express').Router()
const addressControl = require('../controllers/customerAddressController')

router.get('/:customerId', addressControl.fetchAllAddress)
router.post('/', addressControl.createAddress)
router.put('/', addressControl.editAddress)
router.delete('/:addressId/:customerId', addressControl.deleteAddress)

module.exports=router