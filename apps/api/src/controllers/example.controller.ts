import { ExampleSchema } from "@repo/schemas";
import { Request, Response } from "express";

export const getExample = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Connected to database" });
  } catch {
    res.status(500).json({ error: "Database connection failed" });
  }
};

export const createExample = async (req: Request, res: Response) => {
  const result = ExampleSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ message: "Data is valid", data: result.data });
};
