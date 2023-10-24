const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./Configs/corsOptions");
const connectDB = require("./Configs/dbConn");

const { logger, logEvents } = require("./Middleware/logger");
const errorHandler = require("./Middleware/errorHandler");

const authRoutes = require("./Routes/authRoutes");

require("dotenv").config();

const app = express();
const PORT = 5001;

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use("/auth", authRoutes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("Loaded database!");
    app.listen(PORT, () => {
        console.log(`Server initialized on port: http://localhost:${PORT}`);
    });
})

mongoose.connection.on("error", err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
})
