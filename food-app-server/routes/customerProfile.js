const router = require('express').Router()
const profileControl = require('../controllers/customerProfileController')

router.get('/', profileControl.fetchProfiles)
router.post('/', profileControl.createProfile)
router.put('/', profileControl.editProfile)
router.delete('/:profileId/:customerId', profileControl.deleteProfile)

module.exports=router