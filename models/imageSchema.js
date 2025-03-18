import { Schema, model } from "mongoose";
const imageSchema = new Schema({
    fileName: { type: String, required: true },
    //type of image is Buffer
    data: { type: Buffer, required: true }
})

const ImageModel = model("Image", imageSchema)
export default ImageModel