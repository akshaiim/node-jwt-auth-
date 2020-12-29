const express = require("express");
const router = express.Router();
const User = require("../model/User.js");
const Joi = require("@hapi/joi");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// const schema = Joi.object({
//   username: Joi.string().min(6).required(),
//   email: Joi.string().min(6).required().email(),
//   password: Joi.string().min(6).required(),
// });

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(404).send("Email already registered");
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser._id);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("Email not found");

  const pass = bcrypt.compareSync(req.body.password, user.password);
  if (!pass) {
    return res.status(400).send("invalid password");
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
  res.header("auth-token", token).send(token)
  
});

module.exports = router;
