import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userSchema.js'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async( req , res) =>{
    try {
        const { email , password , name  } = req.body

        if ( !email || !password || !name ) {
            return res.status(400).json({ message:"all fields are required " })
        }

        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ message: "User already exist" })
        }
        
        const hashedPassword = await bcrypt.hash(password , 10)

        const user = await User.create({
            email ,
            name,
            password: hashedPassword
        }) 

        const token = jwt.sign(
            { id: user._id , name: user.name , email: user.email  , role: user.role },
            process.env.JWT_SECRET ,
            { expiresIn :"1h" }
        )

        res.status(201).json({ 
            message: "User successfully created" , 
            user,
            token
         })

    } catch (error) {
        console.error("cannot create User" , error)
        res.status(500).json({ message:"Server error while attempting to create a new user" })
    }
}

export const login = async(req , res) => {
    try {
         const { email , password } = req.body
         
         if (!email || !password) {
            return res.status(400).json({ message:"all fields are required" })
         }
         
         const user = await User.findOne({ email })
         if (!user) {
            return res.status(404).json({ message:"email not found" })
         }

         const IsMatched = await bcrypt.compare( password , user.password )
         if (!IsMatched) {
            return res.status(400).json({ message:"invalid credentials" })
         }

         const token = jwt.sign(
            { id:user._id , email:user.email , role: user.role  } ,
            process.env.JWT_SECRET ,
            { expiresIn: "7h" }
         )

         res.status(201).json({
             message:"login successfully",
            user:{ id:user._id , email : user.email , name: user.name , role: user.role },
            token,
         })
         


    } catch (error) {
       console.error("error logging user")
       res.status(500).json({ message:"Server error while logging in user" }) 
    }
}

export const fetchUser = async(req , res) => {
    try {
        const users = await User.find().select('-password')

        if (!users || users.length === 0 ) {
            return res.status(404).json({ message:"cannot fetch users" })
        }

         res.status(200).json({
      message: "Users fetched successfully",
      users
    });

    } catch (error) {
        console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
    }
}

export const deleteUser = async (req , res) => {
    try {
        const { id } = req.params

        if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

        const deleted = await User.findOneAndDelete(id)

        
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

        res.status(200).json({
            message:"deleted successfully" ,
            deleted , 
        })

    } catch (error) {
        console.error("cannot delete user"  , error)
        res.status(500).json({ message:"Server error while deleting User" })
    }
}


export const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body; // frontend sends Google ID token

    if (!token) {
      return res.status(400).json({ message: 'No Google token provided' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If not, create a new user
      user = await User.create({
        name,
        email,
        password: '', // no password since Google handles auth
        role: 'user',
        googleAccount: true,
        profileImage: picture,
      });
    }

    // Generate our own JWT for backend access
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google sign-in successful',
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ message: 'Error verifying Google token' });
  }
};

export const getSingleUser = async(req , res) => {
  try {
    
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message:"User not found" })
    }

    res.status(200).json(user)

  } catch (error) {
    console.error("cannot fetch user" , error)
    res.status(500).json({ message:"Server error while fetching user" })
  }
}