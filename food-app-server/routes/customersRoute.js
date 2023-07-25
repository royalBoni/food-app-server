const router =require('express').Router()
const customerControl = require('../controllers/customersController')

router.get('/:adminId',customerControl.fetchAllCustomers)
router.post('/',customerControl.createCustomer)
router.post('/login',customerControl.loginCustomer)
router.put('/',customerControl.editCustomerPassword)
router.delete('/:id',customerControl.deleteCustomer)

module.exports=router