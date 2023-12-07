import sendEmail from "../utils/sendEmail.js";
import db from "../config/db.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getIssues = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Issues");
  res.json(rows);
});

const createIssue = asyncHandler(async (req, res) => {
  const { title, description, priority, email } = req.body;
  const [rows] = await db.query(
    "INSERT INTO Issues (title, description, priority, assignee) VALUES (?, ?, ?, ?)",
    [title, description, priority, email]
  );

  const [newIssue] = await db.query("SELECT * FROM Issues WHERE id = ?", [
    rows.insertId,
  ]);

  if (newIssue.length) {
    res.status(201).json(newIssue[0]);

    await sendEmail({
      from: req.body.email,
      to: "hello@minimal.io",
      subject: `Issue ${newIssue[0].id} - ${newIssue[0].title}`,
      message: `<p> Issue ${newIssue[0].id}  has been created by ${email}:</p><p>${description}</p>`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid issue data");
  }
});

const replyToIssue = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { reply } = req.body;
  await sendEmail({
    from: "hello@minimal.io",
    to: email,
    subject: "Support Issue",
    message: `<p>Hi, ${reply}</p>`,
  });

  if (newReply.length) {
    res.status(201).json(newReply[0]);
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
