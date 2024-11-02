import {Router} from 'express'
import { createContributorContent, getContributorContent, getContent } from '../controller/contributorGalleryController.js'
import authCheck from '../middleware/authMiddleware.js'

const router  = Router()

router.get('/contributor',authCheck, getContributorContent)
router.get('/content', getContent)
router.post('/contributor',authCheck, createContributorContent)

export default router