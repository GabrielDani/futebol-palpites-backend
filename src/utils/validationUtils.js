import { BadRequestError } from "./customErrors.js";

export function formatZodError(error) {
  return error.errors.map((err) => err.message).join(", ");
}

export const checkSchema = (data, schema) => {
  const validation = schema.safeParse(data);
  if (!validation.success)
    throw new BadRequestError(formatZodError(validation.error));
  return validation.data;
};
