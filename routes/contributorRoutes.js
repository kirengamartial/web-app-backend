import {Router} from 'express'
import { createContributorContent, getContributorContent, getContent, getSingleContent, createComment, getCommentsByContentId, createLike, getLikesByContentId } from '../controller/contributorGalleryController.js'
import authCheck from '../middleware/authMiddleware.js'

const router  = Router()

router.get('/contributor',authCheck, getContributorContent)
router.get('/content', getContent)
router.get('/content/:id', getSingleContent)
router.post('/comments/:contentId', authCheck, createComment);
router.get('/comments/:contentId', getCommentsByContentId);
router.post('/likes/:contentId', authCheck, createLike); 
router.get('/likes/:contentId', getLikesByContentId); 
router.post('/contributor',authCheck, createContributorContent)

export default router