const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { init } = require("./socket");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const auth = require("./middleware/auth");
const routes = require("./routes/index");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const fileUpload = require("express-fileupload");
const path = require("path");
const flash = require("connect-flash");
require("./passport-setup");

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const io = init(server); // Initialize Socket.IO
// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: process.env.FN_HOST, // The frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
swaggerDocument.host =
  process.env.API_HOST || "default-host-if-env-var-not-set";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    //store: MongoStore.create({mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, maxAge: 60000 }, // Set to true if using https
  })
);

app.use(flash());

// Middleware to pass flash messages to the views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(routes);
app.use("/api/v1", routes);

app.get("/", function (req, res) {
  res.send("Backend is running successfully....");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
