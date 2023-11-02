import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Read JWT from the 'jwt' cookie
	token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const [users] = await db
				.promise()
				.query("SELECT * FROM Users WHERE UserID = ? LIMIT 1", [
					decoded.userId,
				]);
			const user = users[0];

			if (!user) {
				res.status(404);
				throw new Error("No user found with this ID");
			}

			// Remove password for security
			delete user.Password;

			req.user = user;

			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	} else {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});
const admin = (req, res, next) => {
	if (req.user && req.user.IsAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as an admin");
	}
};
export { protect, admin };
