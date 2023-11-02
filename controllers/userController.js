import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
// import User from "../models/userModel.js";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public

async function matchPassword(enteredPassword, userPassword) {
	return await bcrypt.compare(enteredPassword, userPassword);
}

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);

	const user = rows[0];

	// You should have a function to check the hashed password against the provided one
	if (user && (await matchPassword(password, user.Password))) {
		generateToken(res, user.UserID);

		res.json({
			_id: user.UserID,
			name: user.Name,
			email: user.Email,
			isAdmin: user.IsAdmin,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const [existingUsers] = await db.query(
		"SELECT * FROM Users WHERE Email = ?",
		[email]
	);

	if (existingUsers.length) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash the password before storing (assuming you're using bcrypt)
	const hashedPassword = await bcrypt.hash(password, 10);

	await db.query("INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)", [
		name,
		email,
		hashedPassword,
	]);

	const [newUser] = await db.query("SELECT * FROM Users WHERE Email = ?", [
		email,
	]);

	generateToken(res, newUser[0].UserID);

	res.status(201).json({
		_id: newUser[0].UserID,
		name: newUser[0].Name,
		email: newUser[0].Email,
		isAdmin: newUser[0].IsAdmin,
	});
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	res.send("get users");
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	res.send("delete user");
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const [users] = await db.query("SELECT * FROM Users WHERE UserID = ?", [
		req.params.id,
	]);

	if (!users.length) {
		res.status(404);
		throw new Error("User not found");
	}

	res.json(users[0]);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const [users] = await db.query("SELECT * FROM Users WHERE UserID = ?", [
		req.params.id,
	]);

	if (!users.length) {
		res.status(404);
		throw new Error("User not found");
	}

	const { name, email, password, isAdmin } = req.body;
	const updatedFields = {
		Name: name || users[0].Name,
		Email: email || users[0].Email,
		Password: password ? await bcrypt.hash(password, 10) : users[0].Password,
		IsAdmin: isAdmin !== undefined ? isAdmin : users[0].IsAdmin,
	};

	await db.query("UPDATE Users SET ? WHERE UserID = ?", [
		updatedFields,
		req.params.id,
	]);

	const [updatedUser] = await db.query("SELECT * FROM Users WHERE UserID = ?", [
		req.params.id,
	]);

	res.json(updatedUser[0]);
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
};
