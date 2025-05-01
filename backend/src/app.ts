import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}`);
});
