import sendEmail from "../utils/sendEmail.js";
import db from "../config/db.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getIssues = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Issues");
  res.json(rows);
});

const createIssue = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignee } = req.body;
  const [rows] = await db.query(
    "INSERT INTO Issues (title, description, priority, status, assignee) VALUES (?, ?, ?, ?, ?)",
    [title, description, priority, status, assignee]
  );

  const [newIssue] = await db.query("SELECT * FROM Issues WHERE id = ?", [
    rows.insertId,
  ]);

  if (newIssue.length) {
    res.status(201).json(newIssue[0]);
  } else {
    res.status(400);
    throw new Error("Invalid issue data");
  }
});

const closeIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    "UPDATE Issues SET status = 'Closed' WHERE id = ?",
    [id]
  );

  const [updatedIssue] = await db.query("SELECT * FROM Issues WHERE id = ?", [
    id,
  ]);

  if (updatedIssue.length) {
    res.status(200).json(updatedIssue[0]);
  } else {
    res.status(400);
    throw new Error("Invalid issue data");
  }
});

export { getIssues, createIssue, closeIssue };
