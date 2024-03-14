const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(cors());

const cabRoutes = require("./routes/cabRoutes");
app.use("/cab", cabRoutes);

const checkRoutes = require("./routes/checkRoutes");
app.use("/check", checkRoutes);

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
