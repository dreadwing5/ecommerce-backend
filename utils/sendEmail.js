import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(userEmail, verificationToken) {
	// Create a transporter
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	});

	// Email options
	const mailOptions = {
		from: process.env.EMAIL,
		to: userEmail,
		subject: "Email Verification For Minimal Store",
		html: `<p>Please verify your email by clicking on the link below:</p>
           <p><a href="http://yourdomain.com/verify-email?token=${verificationToken}">Verify Email</a></p>`,
	};

	// Send the email
	try {
		await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.error("Error sending verification email", error);
	}
}
