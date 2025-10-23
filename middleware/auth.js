import jwt from 'jsonwebtoken'
import User from '../models/userSchema.js'


// Middleware to check if user is logged in
export const authenticate = async(req , res , next ) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) return res.status(401).json({ message: "Not authorized" });

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        req.user = decoded //attach user info to request

         next(); // move to next middleware or route

    } catch (error) {
        res.status(401).json({ message: "Token invalid or expired" }); 
    }
}


export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access only" });
  }
  next(); // user is admin, allow access
};