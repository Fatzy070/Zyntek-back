import express from 'express'
import { getAddress , CreateAddress , updateAddress } from '../controllers/addressController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/address' , authenticate , CreateAddress)

router.get('/address' , authenticate , getAddress)

router.put('/address/:id' , authenticate , updateAddress )

export default router