const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const transferRoutes = require("./routes/transferRoutes");

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use("/api/users", userRoutes);
app.use("/api/transfers", transferRoutes); 


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
