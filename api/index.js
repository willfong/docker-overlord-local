const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");
const { promisify } = require("util");


// Setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

var apiRouter = express.Router();
app.use('/api', apiRouter);

const staticPagePath = process.env.STATIC_PAGE_PATH || "../client/dist";
console.log(`Serving static pages from: ${staticPagePath}`);
app.use(express.static(staticPagePath));

const REPOSITORY_HOSTNAME = process.env.REPOSITORY_HOSTNAME || "http://localhost:5000/v2";
console.log(`Configured Repository: ${REPOSITORY_HOSTNAME}`);
axios.defaults.baseURL = REPOSITORY_HOSTNAME;

const REDIS_HOST = process.env.REDIS_HOST || "localhost:6379"
const client = redis.createClient(`redis://${REDIS_HOST}`);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const DEPLOY_PREFIX = "DEPLOY"

// Routes

apiRouter.get("/repository/list", async (req, res ) => {
  const response = await axios.get("/_catalog");
  return res.json(response.data);
});

apiRouter.get("/repository/tags", async (req, res ) => {
  const repository = req.query.repository;
  if (!repository) return res.status(404).send("404 - Please provide a repository");
  const response = await axios.get(`/${repository}/tags/list`);
  return res.json(response.data);
});

apiRouter.post("/repository/deploy", async (req, res) => {
  const repository = req.body.repository;
  if (!repository) return res.status(404).send("404 - Please provide a repository");
  const tag = req.body.tag;
  if (!tag) return res.status(404).send("404 - Please provide a tag");
  const key = `${DEPLOY_PREFIX}-${repository}`;
  const value = {tag, date: Date.now()}
  await setAsync(key, JSON.stringify(value)).catch(console.error);
  return res.json("ok");
});

apiRouter.get("/repository/status", async (req, res) => {
  const repository = req.query.repository;
  if (!repository) return res.status(404).send("404 - Please provide a repository");
  const key = `${DEPLOY_PREFIX}-${repository}`;
  const response = await getAsync(key).catch(console.error);
  return res.json(JSON.parse(response));
});


app.use(function (req, res, next) {
  console.log("404:", req.originalUrl);
  res.status(404).send("404 - We don't have what you're asking");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("500 - Sorry, we need to fix something");
});

// Start Service
const port = 5000;
app.listen(port, () => {
  console.log(`API server started: http://localhost:${port}`);
});
