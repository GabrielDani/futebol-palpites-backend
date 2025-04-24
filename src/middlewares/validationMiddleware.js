export default function validateSchema(schema, location = "body") {
  return (req, res, next) => {
    const data = req[location];
    console.log(
      "[validationMiddleware] (validateSchema) Validando esquema:\nDados: ",
      data
    );
    const result = schema.safeParse(data);
    console.log("[validationMiddleware] (validateSchema) Resultado: ", result);

    if (!result.success) {
      return res.status(400).json({ error: formatSchemaError(result.error) });
    }

    req[location] = result.data;
    next();
  };
}

function formatSchemaError(error) {
  return error.errors[0].message;
}
