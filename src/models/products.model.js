import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({

    title:{ type: String, required: true},
    price:{ type: Number, required: true},
    code:{ type: Number, required: true, unique: true},
    stock:{ type: Number, required: true},
    description:{ type: String, required: true},
    category:{ type: String, required: true},

},{timestamps:true});

productSchema.plugin(mongoosePaginate);

export default mongoose.model('products', productSchema);
