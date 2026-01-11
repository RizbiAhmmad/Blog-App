import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field type or missing fields!";
  }

  // Prisma known request error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because required record was not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Unique constraint failed.";
    }

    else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed.";
    }
  }

  res.status(statusCode).json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
