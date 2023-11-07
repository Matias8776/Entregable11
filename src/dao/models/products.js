import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  stock: {
    type: Number,
    required: true
  },
  thumbnails: {
    type: []
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    text: true
  },
  status: {
    type: Boolean,
    default: true
  }
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;
