// Create a MySQL connection
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
	host: process.env.HOST,
	user: process.env.DBUSERNAME,
	password: process.env.PASS,
	database: process.env.DB,
});

// Export the pool promise object
export default pool.promise();
