import { Schema, model } from "mongoose"
import { addressSchema } from "./addressSchema.js"
//nested document
/* const addressSchenma = new Schema({
    city: { type: String },
    country: { type: String },
    contactInfo: { type: Number },
    //this document also have id which we dont want it
}, { _id: false }) */


const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "Please provide us with your first name!"]
    },
    last_name: {
        type: String,
        required: [true, "Please provide us with your last name!"]
    },
    email: {
        type: String,
        required: true, unique: [true, "This email is alreday used!provide us with another email!"]
    },
    //adding role help that only user and admin can add product or see orders
    // reloe: { type: String, enum: ["user", "admin"], default: "user" },
    //frist ADMIN ro tarif mikonim chon role admin ro inja darim,tu thunder client,badesh admin ro azinja hazf miknim
    reloe: { type: String, enum: ["user"], default: "user" },
    password: {
        type: String,
        required: true, length: { minlength: [3, "Password it too short!"], maxlength: 15 }
    },
    profile_avatar: {
        //if dont use function it will give error
        type: String,
        default: function () {
            return `https://robohash.org/${this.last_name}`
        }
    },
    // embedded document--another document inside first object
    address: addressSchema,
    /* city: { type: String },
       country: { type: String },
       contactInfo: { type: Number } */
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    confirmEmail: { type: Boolean, default: false },
},
    //create and update time stamp.next line is easier 
    //createdAt: { type: Date, default: Date.now },
    //timeStamp is second object in schema
    { timestamps: true }
)

//creating model
const UserModel = model("User", userSchema)
export default UserModel
//then import it to controller to get,add ...users in controller */







