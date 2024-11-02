import {Router} from 'express'
import { createTest, getTestsByUserId } from '../controller/testController.js' 
import authCheck from '../middleware/authMiddleware.js'

const router  = Router()

router.get('/test',authCheck, getTestsByUserId)
router.post('/test',authCheck, createTest)

export default router