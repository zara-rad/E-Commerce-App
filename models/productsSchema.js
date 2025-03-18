import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    sizes: { type: String, enum: ["XL", "L", "M", "S", "XS", "XXS"] },
    price: { type: Number, required: true },
    rating: { type: String },
    inventory: { type: Number },
    image_url: [{ type: String }]

}, { timestamps: true })

//creating model
const ProductModel = model("Product", productSchema)
export default ProductModel
//then import it to controller to get,add ...products in controller