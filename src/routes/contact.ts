import express, { Request, Response } from "express";
import contactController from "../controllers/contact.controller";

const router = express.Router();

router.post("/identify", async (req: Request, res: Response) => {
  return await contactController.identify(req, res);
});

export { router as contactRouter };
