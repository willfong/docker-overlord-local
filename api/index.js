const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");


const CACHE = require("./cache");
const DB = require("./db");
const UTILS = require("./utils");

// Setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

var apiRouter = express.Router();
app.use('/api', apiRouter);

const unprotectedRoutes = [
  "/api/hello",
  "/api/login-with-username"
];
apiRouter.use(UTILS.routeJWT.unless({ path: unprotectedRoutes }));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log("403 - Token missing for:", req.originalUrl);
    return res.status(403).send(`Authorization token required for: ${req.originalUrl}`);
  }
});

const staticPagePath = process.env.STATIC_PAGE_PATH || "../nuxt/dist";
console.log(`Serving static pages from: ${staticPagePath}`);
app.use(express.static(staticPagePath));


async function getAgentData() {
  /*
[
  {
    registration_end_date: '2020-12-31',
    estate_agent_license_no: 'L3....2K',
    salesperson_name: "'AF...RI",
    registration_no: 'R0...2J',
    registration_start_date: '2019-02-27',
    estate_agent_name: 'ER...TD',
    _id: 1
  },
*/
  const dataUrl =
    "https://data.gov.sg/api/action/datastore_search?resource_id=a41ce851-728e-4d65-8dc5-e0515a01ff31&limit=500";
  const response = await axios.get(dataUrl);
  return response.data.result.records;
}


// Routes
apiRouter.get("/hello", (req, res) => {
  res.json({ msg: "Hello World! You are my sunshine!" });
});

apiRouter.post("/login-with-username", async (req, res) => {
  const username = req.body.username;
  if (!username) return res.status(404).send("404 - Please provide a username");
  console.log("[LOGIN-WITH-USERNAME]", username);
  const token = await UTILS.createJwt(username);
  return res.json({ token, username });
});

apiRouter.get("/all", async (req, res) => {
  const kittens = await DB.Kitten.find();
  console.log(kittens);
  res.send(kittens);
});

apiRouter.post("/add", (req, res) => {
  const newKitten = new DB.Kitten({ name: req.body.name });
  newKitten.save();
  res.json(newKitten);
});

apiRouter.get("/cacheGet", async (req, res) => {
  const key = req.query.key;
  const response = await CACHE.get(key);
  res.json(response);
});

apiRouter.post("/cacheSet", async (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  const ttl = req.body.ttl;
  await CACHE.set(key, value, ttl);
  const response = await CACHE.get(key);
  res.json(response);
});

apiRouter.get("/agents/populate", async (req, res) => {
  const agents = await getAgentData();
  DB.Agent.deleteMany({}, function (err) {
    if (err) console.log(err);
  });
  agents.forEach((agent) => {
    DB.Agent.create(agent, function (err, instance) {
      if (err) {
        console.log(err);
      } else {
        console.log("Saved!", instance.registration_no);
      }
    });
  });
  res.send("Done");
});

apiRouter.get("/agents", async (req, res) => {
  console.log("Fetching agents from database");
  let options = {};
  if (req.query.limit) {
    console.log("Limiting recrods to:", req.query.limit);
    options['limit'] = parseInt(req.query.limit, 10);
  }
  DB.Agent.find({}, null, options, (err, results) => {
    if (err) {
      console.log(err);
      res.json("Error");
    } else {
      res.json(results);
    }
  });
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
