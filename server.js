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
require("./passport-setup");

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const io = init(server); // Initialize Socket.IO

app.use(cors());
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

app.use(routes);
app.use("/api/v1", routes);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get("/", function (req, res) {
  res.send("Backend is running successfully....");
});

app.get("/google-login", (req, res) => {
  res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send('<h1>Dashboard</h1><a href="/auth/logout">Logout</a>');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
