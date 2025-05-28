const express = require("express");
const User = require("../models/users.schema");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

const signupBody = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
});

const signinBody = z.object({
  username: z.string(),
  password: z.string(),
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

router.post("/signin", async (req, res) => {
  try {
    const { success, error } = signinBody.safeParse(req.body);

    if (!success) {
      res.send({
        msg: "Incorrect Inputs!",
        error: error,
      });
    }

    const { username, password } = req.body;

    const user = await User.findOne({
      username: username,
      password: password,
    });

    if (!user) {
      res.status(404).send({
        msg: "User doesn't exists!",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );

    res.status(200).send({
      msg: "Sign in successful",
      username: user.username,
      token: token,
    });
  } catch (err) {
    res.status(500).send({
      msg: "Internal server error",
      error: err,
    });
  }
});

const updateBody = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;

    const { success, error } = updateBody.safeParse(req.body);

    if (!success) {
      res.status(411).send({
        msg: "Error while updating information",
        error: error,
      });
    }

    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      res.send({
        msg: "You must be login!",
      });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.status(200).send({
      msg: "User updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      msg: "Internal Server error",
    });
  }
});


router.get("/profile", authMiddleware, async(req, res) =>{
  const userId = req.body.userId;

  const user = await User.findOne({
    _id: userId
  })

  if(!user){
    res.status(404).send({
      msg: "User not found!"
    })
  }

  res.status(200).send({
    msg: "User Profile fetched successfully",
    username: user.username,
    firstName: user.firstName, 
    lastName: user.lastName
  })
})
module.exports = router;
