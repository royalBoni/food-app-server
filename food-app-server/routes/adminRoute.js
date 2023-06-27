const router = require('express').Router()
const adminControl = require('../controllers/adminController')


router.get('/', adminControl.fetchAdmin)
router.post('/', adminControl.createAdmin)
router.post('/login', adminControl.loginAdmin)
router.put('/:id', adminControl.editAdmin)
router.delete('/:id', adminControl.deleteAdmin)

module.exports= router