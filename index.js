import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import connectDB from './config/db.js'
import cartRoutes from './routes/cartRoutes.js'
import wishListRoutes from './routes/wishListRoutes.js'
import addressRoutes from './routes/addressRoutes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(express.json({ extended: true }))
app.use(cors())

app.use('/api' , userRoutes)
app.use('/api' , productRoutes)
app.use('/api/cart' , cartRoutes)
app.use("/api/wishlist", wishListRoutes);
app.use("/api", addressRoutes);


app.listen( PORT , () => {
    console.log(`server is running on http://localhost:${PORT}`)
} )