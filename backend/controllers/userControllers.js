const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, pic } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All input fields are required" });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        pic:
          pic ||
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup Successful",
      id: user.id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All input fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      id: user.id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// /api/user?search=atharva
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        OR: [
          { username: { contains: req.query.search, mode: "insensitive" } },
          { email: { contains: req.query.search, mode: "insensitive" } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where: {
      ...keyword,
      id: { not: req.user.id }, // Exclude current user
    },
    select: {
        id: true,
        username: true,
        email: true,
        pic: true,
    }
  });
  res.send(users);
};

module.exports = { registerUser, authUser, allUsers };
