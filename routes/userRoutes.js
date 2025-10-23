import express from 'express'
import { register , login , fetchUser , deleteUser , googleSignIn  , getSingleUser} from '../controllers/userController.js' 
import { authenticate , isAdmin } from '../middleware/auth.js'
const router = express.Router()

router.get('/users' , authenticate , isAdmin , fetchUser )
router.get('/user/me' , authenticate , getSingleUser)

router.post('/register'  , register)
router.post('/login' , login)
router.post('/google' , googleSignIn)

router.delete('/user/:id' , authenticate , isAdmin , deleteUser )

export default router 