import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: function () {
          // Password required only for manual sign-up (not Google login)
          return !this.googleId;
        },
      },
      googleId: {
        type: String, // Used for Google Authentication
        unique: true,
        sparse: true, // Ensures uniqueness but allows null
      },
      role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        required: true,
      },
      googleAuthenticated: {
        type: Boolean,
        default: false, // Marks whether the user has connected their Google account
      },
      addedByAdmin: {
        type: Boolean, // Tracks whether admin created the user
        default: false,
      },
      registrationKey: {
        type: String, // Only for admin registration
        required: function () {
          return this.role === 'admin';
        },
        select: false, // Prevents it from being exposed in queries
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId, // Tracks which admin created the user
        ref: 'User',
        default: null,
      },
});


// userSchema.pre('save',async function (next){
//   if(this.isModified('password')){
//     this.password= await bcrypt.hash(this.password,10)
//   }

//   next();

// })
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);