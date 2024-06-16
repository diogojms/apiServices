const express = require("express");
const router = express.Router();
const serviceController = require("../Controllers/serviceController");
const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token inválida" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res
      .status(401)
      .json({ msg: "Erro na verificação do token", error: err.message });
  }
}

function isAdmin(req, res, next) {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(" ");
  const tokenData = jwt.verify(token[1], process.env.SECRET);

  if (tokenData.role == 3) next();
  else res.status(403).json();
}

router.post("/", checkToken, isAdmin, serviceController.CreateService);
router.put("/:id", checkToken, isAdmin, serviceController.EditService);
router.delete("/:id", checkToken, isAdmin, serviceController.RemoveService);
router.get("/count", checkToken, serviceController.CountServices);
router.get("/:id", serviceController.ReadService);
router.get("/", serviceController.ReadServices);

module.exports = router;
