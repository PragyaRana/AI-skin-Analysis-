import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required." });
    if (await User.findOne({ email }))
      return res.status(409).json({ error: "Email already registered." });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user: { _id: user._id, name: user.name, email: user.email, totalScans: 0 } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });
    res.json({ token: sign(user._id), user: { _id: user._id, name: user.name, email: user.email, totalScans: user.totalScans } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/me", protect, (req, res) => res.json({ user: req.user }));

export default router;
