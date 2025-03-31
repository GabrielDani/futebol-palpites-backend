import "dotenv/config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bolão de Futebol API",
      version: "1.0.0",
      description:
        "API para o sistema de apostas em jogos do Campeonato Brasileiro",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default options;
