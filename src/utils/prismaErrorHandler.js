// utils/prismaErrorHandler.js
import { Prisma } from "@prisma/client";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "./customErrors.js";

export function handlePrismaError(error) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw new InternalServerError("Erro interno do servidor.");
  }

  switch (error.code) {
    case "P2025":
      throw new NotFoundError("Registro não encontrado");
    case "P2002":
      throw new ConflictError("Violação de constraint única");
    case "P2003":
      throw new BadRequestError(
        "Falha na constraint de chave estrangeira no campo"
      );
    default:
      throw new InternalServerError(`Erro no banco de dados: ${error.code}`);
  }
}
