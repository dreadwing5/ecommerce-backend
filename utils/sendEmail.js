import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (options) => {
  console.log("options", options);
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;

// export async function sendVerificationEmail(userEmail, verificationToken) {
// 	// Create a transporter
// 	const transporter = nodemailer.createTransport({
// 		service: "Gmail",
// 		auth: {
// 			user: process.env.EMAIL,
// 			pass: process.env.PASSWORD,
// 		},
// 	});

// 	// Email options
// 	const mailOptions = {
// 		from: process.env.EMAIL,
// 		to: userEmail,
// 		subject: "Email Verification For Minimal Store",
// 		html: `<p>Please verify your email by clicking on the link below:</p>
//            <p><a href="http://yourdomain.com/verify-email?token=${verificationToken}">Verify Email</a></p>`,
// 	};

// 	// Send the email
// 	try {
// 		await transporter.sendMail(mailOptions);
// 		console.log("Verification email sent successfully");
// 	} catch (error) {
// 		console.error("Error sending verification email", error);
// 	}
// }
