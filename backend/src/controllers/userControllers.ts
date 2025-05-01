import userServices from "../services/userServices";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";

const AUTH_SERVICE_URL = "http://localhost:3002/api/auth";

const userControllers = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingEmail = await userServices.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userServices.createUser(name, email, hashedPassword);

      if (!user)
        return res.status(400).json({ error: "Failed to create user" });

      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  loginUser: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const user = await userServices.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "Email not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Invalid password",
        });
      }

      try {
        const authResponse = await axios.post<{
          token: string;
          error?: boolean;
          refreshToken: string;
        }>(`${AUTH_SERVICE_URL}/login`, { email, password });

        if (authResponse.data.error) {
          return res.status(500).json({
            error: "Authentication error",
          });
        }

        return res.status(200).json({
          message: "Login successful",
          user: user,
          token: authResponse.data.token,
          refreshToken: authResponse.data.refreshToken,
        });
      } catch (authError) {
        return res.status(500).json({
          error: "Error authenticating with external service",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Error while trying to login",
      });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    const user_id = req.params.id;

    try {
      const user = await userServices.getUserById(Number(user_id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const user_id = req.params.id;
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userServices.updateUser(Number(user_id), {
        name,
        email,
        password: hashedPassword,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    const user_id = req.params.id;

    try {
      const user = await userServices.deleteUser(Number(user_id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },
};

export default userControllers;
