import { Router } from "express";
import userControllers from "../controllers/userControllers";
import { Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  userControllers.register(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  userControllers.loginUser(req, res);
});

router.get("/:id", authMiddleware, (req: Request, res: Response) => {
  userControllers.getUserById(req, res);
});

router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  userControllers.updateUser(req, res);
});

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  userControllers.deleteUser(req, res);
});

export default router;
