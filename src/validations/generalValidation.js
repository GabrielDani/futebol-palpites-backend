import { z } from "zod";

export const uuidSchema = z
  .string({ invalid_type_error: "O ID deve ser uma string" })
  .uuid("O ID deve ser um UUID válido");

export const positiveIntSchema = z
  .number({ invalid_type_error: "Deve ser um número" })
  .int("Deve ser um número inteiro")
  .min(0, "Deve ser positivo");
