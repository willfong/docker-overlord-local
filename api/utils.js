const JWT = require("express-jwt");
const jwt = require("jsonwebtoken");

function signingKey() {
  return "something secret here";
}

const routeJWT = JWT({ secret: signingKey(), algorithms: ["HS256"] });

async function createJwt(sub) {
  return jwt.sign({ sub }, signingKey(), { algorithm: "HS256" });
}

async function decodeJwt(token) {
  return jwt.decode(token);
}

module.exports = {
  signingKey,
  routeJWT,
  createJwt,
  decodeJwt,
};
