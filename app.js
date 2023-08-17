// importing required modules
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

// import custom modules
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes");
const userRouter = require("./routes/userRoutes");
const playerRouter = require("./routes/playerRoutes");
const squadRouter = require("./routes/squadRoutes");
const gameSetupRouter = require("./routes/gameSetupRoutes");
const statRouter = require("./routes/statRoutes");

// The express() function is called to create an Express application instance named app.
const app = express();

// View Engine Setup: - The app is configured to use the Pug template engine for rendering views.
// The views directory is set to the "views" folder using path.join().
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware Configuration: Various middleware are configured using app.use(). These include express.json(), bodyParser.urlencoded(), bodyParser.json(), cookieParser(), and serving static files using express.static().
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Helmet Security Middleware: The helmet() middleware is used to enhance security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Logging Middleware (Development): In development mode, the morgan middleware is used to log requests and response
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting Middleware: The express-rate-limit middleware is used to limit the number of requests from a single IP within a specific time window.
const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Data Sanitization Middleware: The express-mongo-sanitize middleware is used to prevent NoSQL injection attacks by sanitizing user input.
app.use(mongoSanitize());

// Cross-Site Scripting (XSS) Protection Middleware: The xss-clean middleware is used to prevent XSS attacks by sanitizing user input
app.use(xss());

// *** HTTP Parameter Pollution (HPP) Protection Middleware: The hpp middleware prevents HTTP parameter pollution attacks by whitelisting specific query parameters. (need to change these) ***
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "difficulty",
      "price",
      "ratingsAverage",
      "maxGroupSize",
    ],
  })
);

// Request Timestamp Middleware: A custom middleware adds the current request timestamp to req.requestTime
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// Method Override Middleware: allows using HTTP verbs such as PUT and DELETE through query parameters or request headers.
app.use(methodOverride("_method"));

// Routing: Different route modules (viewRouter, userRouter, etc.) are connected using app.use() to handle specific routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/squads", squadRouter);
app.use("/api/v1/gameSetups", gameSetupRouter);
app.use("/api/v1/stats", statRouter);

// 404 Error Handling: An error-handling middleware is used to handle undefined routes by creating an AppError and passing it to next() with a 404 status.
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware: used to handle errors globally and send appropriate responses.
app.use(globalErrorHandler);

// Exporting Express App: the app instance is exported as a module, allowing it to be used and started in other parts of the application.
module.exports = app;
