export function formatZodError(error) {
  return error.errors.map((err) => err.message).join(", ");
}
