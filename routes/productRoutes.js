import express from 'express'
const router = express.Router()
import { getAllProducts,  createProduct , deleteProduct , getProductById , searchProduct } from '../controllers/productController.js'
import { isAdmin , authenticate } from '../middleware/auth.js'


// Routes
router.get('/products', getAllProducts)
router.get('/search' , searchProduct)

router.delete('/product/:id' , authenticate , isAdmin , deleteProduct )
router.get('/product/:id' , getProductById)
router.post('/product',authenticate, isAdmin, createProduct) // Use multer middleware for file upload


export default router 