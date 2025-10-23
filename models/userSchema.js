import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      // password only required if NOT a Google account
      return !this.googleAccount;
    },
  },
  googleAccount: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  profileImage: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);


