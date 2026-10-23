import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/auth.model.js";

function setLoginCookie(response, user) {
  const isProduction = process.env.NODE_ENV === "production";
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  response.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

export async function registerUser(request, response) {
  const { name: formName, email: formEmail, password } = request.body;
  const name = typeof formName === "string" ? formName.trim() : "";
  const email = formEmail?.trim().toLowerCase();

  if (!name || !email || typeof password !== "string" || !password) {
    return response.status(400).json({
      success: false,
      message: "Name, email, and password are required.",
    });
  }

  if (password.length < 8) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);

    setLoginCookie(response, user);
    return response.status(201).json({ success: true, user });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Register error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Could not create your account.",
    });
  }
}

export async function loginUser(request, response) {
  const { email: formEmail, password } = request.body || {};
  const email = formEmail?.trim().toLowerCase();

  if (!email || !password) {
    return response.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await findUserByEmail(email);
    const passwordIsCorrect = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordIsCorrect) {
      return response.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    setLoginCookie(response, user);
    return response.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
}

export async function getProfile(request, response) {
  try {
    const user = await findUserById(request.user.userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    return response.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Could not load your account.",
    });
  }
}

export function logoutUser(request, response) {
  const isProduction = process.env.NODE_ENV === "production";

  response.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return response.json({ success: true, message: "You are logged out." });
}
