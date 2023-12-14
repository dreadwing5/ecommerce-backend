import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import db from "./config/db.js";
import sendEmail from "./utils/sendEmail.js";

const port = process.env.PORT || 5000;

const app = express();

const allowedOrigins = [
  "http://3.91.202.182:3000",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // To allow cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/issues", serviceRoutes);

app.get("/", async (req, res) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM Users");
    console.log(rows, fields);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/support/issue", async (req, res) => {
  try {
    await sendEmail({
      from: req.body.email,
      to: "hello@minimal.io",
      subject: "Support Issue",
      message: `<p>You have received a new support issue from ${req.body.email}:</p><p>${req.body.message}</p>`,
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in  mode on port ${port}`));
