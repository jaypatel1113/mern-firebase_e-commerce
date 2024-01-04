import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;

    if (!id) return next(new ErrorHandler("Please login, to access resources", 401));
    // if (!id) return next(new ErrorHandler("Saale Login Kr phle", 401));

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Dont you dare to use fake ID", 401));
    // if (!user) return next(new ErrorHandler("Saale Fake ID Deta Hai", 401));
    
    if (user.role !== "admin")
        return next(new ErrorHandler("Unauthorized", 403));
        // return next(new ErrorHandler("Saale Aukat Nhi Hai Teri", 403));

    next();
});
