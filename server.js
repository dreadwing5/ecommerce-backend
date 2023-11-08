import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import db from "./config/db.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// app.get("/", (req, res) => {
// 	res.send("API is running...");
// });

app.get("/", async (req, res) => {
	try {
		const [rows, fields] = await db.query("SELECT * FROM Users");
		console.log(rows, fields);
	} catch (err) {
		console.log(err);
	}
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
