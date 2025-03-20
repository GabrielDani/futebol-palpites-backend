export default function errorMiddleware(err, req, res, next) {
  console.err(err);

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor. " });
}
