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

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes");
const userRouter = require("./routes/userRoutes");
const playerRouter = require("./routes/playerRoutes");
const squadRouter = require("./routes/squadRoutes");
const gameSetupRouter = require("./routes/gameSetupRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10kb" }));
app.use(cookieParser());

// serving static files
app.use(express.static(path.join(__dirname, "public")));

//app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

app.use(mongoSanitize());

app.use(xss());

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

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

app.use(methodOverride("_method"));

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/squads", squadRouter);
app.use("/api/v1/gameSetups", gameSetupRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
