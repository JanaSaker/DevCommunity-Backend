import { db } from "../Models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize"; 

const User = db.Users;

const addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const profile = req.file?.filename;

    console.log(req.body);

    if (!username || !email || !password || !profile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate username or email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profile,
      role,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_STRING,
      {
        expiresIn: process.env.LOGIN_EXPIRES,
      }
    );

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).send(error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).send({ message: "No users in the database" });
    }
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send(error.message);
  }
};

const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const user = await User.findByPk( id );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.update(req.body, { where: { id } });
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.destroy({ where: { id } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_STRING,
      { expiresIn: process.env.LOGIN_EXPIRES }
    );
    res.status(200).json({
      status: "Login successfu",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send(error.message);
  }
};

export {
  addUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  login,
};
