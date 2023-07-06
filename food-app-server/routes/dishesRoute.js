const router = require('express').Router()
const dishControl =require('../controllers/dishesController')
const multer = require('../config/multer')

router.get('/',dishControl.fetchDishes)
router.post('/', multer.single('image'),dishControl.createDish)
router.put('/',multer.single('image'),dishControl.editDish)
router.delete('/:dishId/:adminId',dishControl.deleteDish)

module.exports=router