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

	const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);

	const user = rows[0];

	// You should have a function to check the hashed password against the provided one
	if (user && (await matchPassword(password, user.password))) {
		generateToken(res, user.id);

		res.json({
			id: user.id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
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
		"SELECT * FROM Users WHERE email = ?",
		[email]
	);

	if (existingUsers.length) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash the password before storing (assuming you're using bcrypt)
	const hashedPassword = await bcrypt.hash(password, 10);

	await db.query("INSERT INTO Users (name, email, Password) VALUES (?, ?, ?)", [
		name,
		email,
		hashedPassword,
	]);

	const [newUser] = await db.query("SELECT * FROM Users WHERE email = ?", [
		email,
	]);

	generateToken(res, newUser[0].id);

	res.status(201).json({
		id: newUser[0].id,
		name: newUser[0].name,
		email: newUser[0].email,
		isAdmin: newUser[0].isAdmin,
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
	const user = await User.findById(req.user.id);

	if (user) {
		res.json({
			id: user.id,
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
	const user = await User.findById(req.user.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			id: updatedUser.id,
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
	const [users] = await db.query("SELECT * FROM Users");
	if (users.length === 0) return res.send("Add a User First");
	else return res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	try {
		const [result] = await db.query("DELETE FROM Users WHERE id = ?", [
			req.params.id,
		]);

		if (result.affectedRows === 0) {
			console.log("No user found with the specified ID.");
			res.status(404).send("User not found.");
		} else {
			console.log("User deleted successfully.");
		}
	} catch (error) {
		console.error("Error during the delete operation:", error);
		res.status(500).send("An error occurred.");
	}
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const [users] = await db.query("SELECT * FROM Users WHERE id = ?", [
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
	const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [
		req.params.email,
	]);
	console.log(users);

	if (!users.length) {
		res.status(404);
		throw new Error("User not found");
	}

	const { gender, phone } = req.body;

	const updatedFields = {
		Gender: gender || users[0].Gender,
		Phone: phone || users[0].Phone,
	};

	await db.query("UPDATE Users SET ? WHERE id = ?", [
		updatedFields,
		req.params.id,
	]);

	const [updatedUser] = await db.query("SELECT * FROM Users WHERE id = ?", [
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
