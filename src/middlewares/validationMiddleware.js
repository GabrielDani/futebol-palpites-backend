export default function validateSchema(schema, location = "body") {
  return (req, res, next) => {
    const data = req[location];
    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json(formatSchemaError(result.error));
    }

    req[location] = result.data;
    next();
  };
}

function formatSchemaError(error) {
  return error.errors.map((err) => err.message).join(", ");
}
