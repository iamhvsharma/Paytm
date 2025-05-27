const express = require("express");
const User = require("../models/users.schema");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const router = express.Router();

const signupBody = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
});

router.post("/signup", async (req, res) => {
  try {
    // Input checking
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(411).send({
        msg: "Incorrect Inputs",
      });
    }

    const { username, password, firstName, lastName } = req.body;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      const user = await User.create({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET
      );

      res.status(200).send({
        MSG: "User created successfully!",
        userId: user._id,
        username: user.username,
        token: token,
      });
    } else {
      res.status(400).send({
        MSG: "User already exist!",
      });
    }
  } catch (error) {
    res.status(500).send({
      MSG: "Internal server error!",
      error: error,
    });
  }
});

module.exports = router;
