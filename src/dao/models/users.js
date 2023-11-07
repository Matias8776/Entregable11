import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
});

userSchema.pre('find', function (next) {
  this.populate('carts._id');
  next();
});

const usersModel = mongoose.model(userCollection, userSchema);

export default usersModel;
