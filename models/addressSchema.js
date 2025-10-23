import mongoose from "mongoose";
const Schema = mongoose.Schema


const addressSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    } ,
    phone:{
        type:Number,
        required:true ,
    },
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    } ,
    city:{
        type:String,
        required:true
    },
    DeliveryAddress:{
        type:String,
        required:true
    } ,   
}, {timestamps:true})

export default mongoose.model('address' , addressSchema)