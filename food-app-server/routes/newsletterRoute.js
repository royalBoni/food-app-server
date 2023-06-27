const express = require('express')
const router = express.Router()
const newsletterControl = require('../controllers/newsletterController')

router.post('/', newsletterControl.subscribeNewsletter)
router.delete('/:id', newsletterControl.unSubscribeNewsletter)

module.exports=router