import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (validated.body) req.body = validated.body;
      if (validated.params) req.params = validated.params;
      if (validated.query) req.query = validated.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(
            400,
            "Validation failed",
            error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          ),
        );
      }

      next(error);
    }
  };
};
