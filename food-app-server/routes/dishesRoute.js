const router = require('express').Router()
const disheControl =require('../controllers/dishesController')
const multer = require('../config/multer')

router.get('/',disheControl.fetchDishes)
router.post('/', multer.single('image'),disheControl.createDish)
router.put('/:dishId',multer.single('image'),disheControl.editDish)
/* router.put('/:id',disheControl.editDish)
router.delete('/:id',disheControl.deleteDish) */

module.exports=router