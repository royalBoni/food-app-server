const router = require('express').Router()
const dishReviewControl = require('../controllers/dishReviewController')


router.get('/',dishReviewControl.fetchDishReviews)
router.get('/:userId',dishReviewControl.fetchDishReviewsById)
router.delete('/:reviewId/:userId',dishReviewControl.deleteDishReview)
router.post('/',dishReviewControl.createDishReview)

module.exports=router