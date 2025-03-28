import { z } from "zod";

export const createFieldSchema = {
  string: (fieldName, { min, max, defaultValue, required = true } = {}) => {
    let schema = z.string({
      invalid_type_error: `O campo ${fieldName} deve ser uma string`,
      required_error: `O campo ${fieldName} é obrigatório`,
    });

    if (min !== undefined)
      schema = schema.min(
        min,
        `O campo ${fieldName} deve ter no mínimo ${min} caracteres`
      );

    if (max !== undefined)
      schema = schema.max(
        max,
        `O campo ${fieldName} deve ter no máximo ${max} caracteres`
      );

    if (defaultValue !== undefined) schema = schema.default(defaultValue);

    return required ? schema : schema.optional();
  },

  uuid: (fieldName, { required = true } = {}) => {
    const schema = z
      .string({
        invalid_type_error: `O campo ${fieldName} deve ser uma string`,
        required_error: `O campo ${fieldName} é obrigatório`,
      })
      .uuid(`O campo ${fieldName} deve ser um UUID válido`);

    return required ? schema : schema.optional();
  },

  positiveInt: (
    fieldName,
    { min, max, defaultValue, required = true } = {}
  ) => {
    let schema = z.coerce
      .number({
        invalid_type_error: `O campo ${fieldName} deve ser um número`,
        required_error: `O campo ${fieldName} é obrigatório`,
      })
      .int(`O campo ${fieldName} deve ser um número inteiro`);

    if (min !== undefined)
      schema = schema.min(
        min,
        `O campo ${fieldName} deve ser maior ou igual a ${min}`
      );
    if (max !== undefined)
      schema = schema.max(
        max,
        `O campo ${fieldName} deve ser menor ou igual a ${max}`
      );

    if (defaultValue !== undefined) schema = schema.default(defaultValue);

    return required ? schema : schema.optional();
  },

  boolean: (fieldName, { defaultValue, required = true } = {}) => {
    let schema = z.boolean({
      invalid_type_error: `O campo ${fieldName} deve ser um boolean`,
      required_error: `O campo ${fieldName} é obrigatório`,
    });

    if (defaultValue !== undefined) schema = schema.default(defaultValue);

    return required ? schema : schema.optional();
  },

  date: (fieldName, { defaultValue, required = true } = {}) => {
    let schema = z
      .string({
        invalid_type_error: `O campo ${fieldName} deve ser uma string`,
      })
      .datetime(`A data do campo ${fieldName} deve estar no formato ISO 8601`);

    if (defaultValue !== undefined) schema = schema.default(defaultValue);

    return required ? schema : schema.optional();
  },

  url: (fieldName, { defaultValue, required = false } = {}) => {
    let schema = z
      .string({
        invalid_type_error: `O campo ${fieldName} deve ser uma string`,
        required_error: `O campo ${fieldName} é obrigaatório`,
      })
      .url(`A URL do campo ${fieldName} deve ser uma URL válida`);

    if (defaultValue !== undefined) schema = schema.default(defaultValue);

    return required ? schema : schema.optional();
  },

  transformPartial: (schema) => {
    return schema
      .partial()
      .refine(
        (data) => Object.values(data).some((val) => val !== undefined),
        "Pelo menos um campo deve ser fornecido"
      );
  },
};
