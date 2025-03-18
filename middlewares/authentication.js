import jwt from "jsonwebtoken";
import UserModel from "../models/usersSchema.js";
export const auth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (token) {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            if (!decode) throw new Error("invalid token");
            //decode {_id:"gfhsdfgh12331", email:"user@gmail"}
            const user = await UserModel.findById(decode._id)
            req.user = user;
            //forwarding request to next handler
            next();
        } else {
            res.send({ success: false, message: "token is required!" });
        }
    } catch (err) {
        next(err);
    }
};
