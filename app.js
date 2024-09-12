require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const logger = require("morgan");
const router = require("./routes/index");
const favicon = require("serve-favicon");

const prismic = require("@prismicio/client");

const { siteConfig } = require("./config/index");

const port = 3000;
const UAParser = require("ua-parser-js");

app.use(express.static(path.join(__dirname, "dist")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use((req, res, next) => {
  const ua = UAParser(req.headers["user-agent"]);

  console.log("ua", ua.device.type);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isTablet = ua.device.type === "tablet";
  res.locals.isPhone = ua.device.type === "mobile";

  res.locals.Prismic = prismic;
  res.locals.Link = siteConfig.handleLinkResolver;
  next();
});

app.use(favicon("public/meta/favicon.ico"));

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
}

app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
