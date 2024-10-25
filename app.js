// Import dependencies
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import moment from "moment-timezone";

dotenv.config();
morgan.token("date", (req, res) => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
});

// Import my dependencies
import AppError from "./src/utils/AppError.js";
import errorHandler from "./src/utils/errorHandler.js";

//  initialization
const app = express();
const PORT = process.env.PORT || 3000;
const productionMode = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "https://mapty.tiven.xyz",
  "http://38.183.46.228", // Replace with the desired IP address
];
// App Configuration
app.set("env", process.env.NODE_ENV);
app.set("x-powered-by", false);
app.set("trust proxy", true);
app.set("port", PORT || 3000);

// Use middlewares
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 100 requests per windowMs
    keyGenerator: (req, res) => {
      return req.headers["x-real-ip"] || req.ip;
    },
  })
);
// app.use(cors());
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin); // Log the origin
      const allowedOrigins = [
        "https://mapty.tiven.xyz"
            ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: productionMode
      ? {
          useDefaults: true,
          directives: {
            "script-src": ["'self'"],
            "object-src": ["'none'"],
          },
        }
      : false,
  })
);
if (!productionMode) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("common"));
}

// Import routes and use routs
import helloRoute from "./src/routes/helloRoute.js";
app.use("/", helloRoute);

// Error Handling middleware
app.use((req, res, next) => {
  next(new AppError("Page Not found", 404, "Getting " + req.originalUrl));
});
app.use(errorHandler);

// Handle unhandled promise rejections and uncaught exceptions
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

// Start the app
const server = app.listen(app.get("port"), () => {
  console.log(
    `Server is running on http://localhost:${app.get("port")} in ${
      productionMode ? "production" : "development"
    } mode`
  );
});
