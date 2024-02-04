import { Request, Response, NextFunction } from "express";

export async function setupRemixContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.name = "test3";

  next();
}
