import Address from '../models/addressSchema.js'

export const CreateAddress = async(req , res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const userAddress = req.body

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }
 const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      const updatedAddress = await Address.findOneAndUpdate(
        { userId },
        { ...userAddress },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address: updatedAddress
      });
    }
        const address = await Address.create({ ...userAddress , userId })

        res.status(200).json({
            message:"successfully created an address" , 
            address
        })
    } catch (error) {
        console.error('cannot create address' , error)
        res.status(500).json({message: "Server error while creating an address"})
    }
}

export const getAddress = async(req , res) => {
    try {
        const userId = req.user?.id || req.user?._id

        if (!userId) {
            return res.status(400).json({ success:false , message:"User not authenticated" })
        }

        const address = await Address.findOne({ userId })

        res.status(200).json({
            success:true,
            address
        })
        
    } catch (error) {
        console.error('cannot fetch address' , error)
        res.status(500).json({ message:"Server error while fetching address" })
    }
}

export const updateAddress = async(req , res ) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { id } = req.params
        const userAddress = req.body;

     const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      { ...userAddress },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

     res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });


    } catch (error) {
         console.error("cannot update address", error);
    res.status(500).json({ message: "Server error while updating address" });
    }
}