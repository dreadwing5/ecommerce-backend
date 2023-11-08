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
import sendEmail from "./utils/sendEmail.js";

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

app.post("/send-email", async (req, res) => {
  try {
    await sendEmail({
      email: req.body.email,
      subject: "Test Email",
      message:
        "This is a test email to verify the functionality of the sendEmail API.",
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.post("/api/support/issue", async (req, res) => {
  try {
    await sendEmail({
      from: req.body.email,
      to: "hello@minimal.io",
      subject: "Support Issue",
      html: `<p>You have received a new support issue from ${req.body.email}:</p><p>${req.body.message}</p>`, // If you want to send HTML emails
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
