import { Schema, model } from "mongoose"

export const addressSchema = new Schema({
    city: { type: String },
    country: { type: String },
    contactInfo: { type: Number },
    //this document also have id which we dont want it
}, { _id: false })