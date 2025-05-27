const express = require("express");
const User = require("../models/users.schema");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
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

    res.status(200).send({
        MSG: "User created successfully!",
        userId: user._id,
        username: user.username
    })
  } else {
    res.status(400).send({
        MSG: "User already exist!"
    })
  }
  } catch (error) {
    res.status(500).send({
        MSG: "Internal server error!",
        error: error
    })
  }
});

module.exports = router;
