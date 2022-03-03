const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../Model/UserModel");
const {
  registerValidation,
  loginValidation,
} = require("../Validation/SchemaValidation");
const jwt = require("jsonwebtoken");

async function generateToken(data) {
  //   console.log("YO");
  //   console.log(data);
  const token = await jwt.sign(
    {
      _id: data._id,
      Name: data.user_name,
    },
    process.env.JWT_SECRET
  );
  return token;
}

// Register

router.post("/addUser", async (req, res) => {
  // Checking for validation wrt the schema defined
  const { error } = registerValidation(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
  }

  // check if the user already exists in the db
  const userFound = await UserModel.findOne({
    user_email: req.body.user_email,
  });
  if (userFound) {
    return res.status(400).send({ message: "User already exists" });
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.user_pass, salt);

  //   Creating a new user
  const user = new UserModel({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_pass: hashedPass,
  });

  try {
    const newUser = await user.save();
    // Generate the jwt Token
    const _token = await generateToken(newUser);
    res
      .header("Auth-Token", _token)
      .send({ message: "Signup success!", token: _token });
  } catch (err) {
    res.send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  // Checking for validation wrt the schema defined
  const { error } = loginValidation(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
  }

  // finding the user from the db
  const user = await UserModel.findOne({
    user_email: req.body.user_email,
  });
  if (!user) {
    return res.status(400).send({ message: "Invalid Login Credentials" });
  }

  // compare passwords
  const validPass = await bcrypt.compare(req.body.user_pass, user.user_pass);
  if (!validPass) {
    return res.status(400).send({ message: "Invalid Login Credentials" });
  }

  // Generate the jwt Token
  const _token = await generateToken(user);
  res
    .header("Auth-Token", _token)
    .send({ message: "Login success!", token: _token });
});

module.exports = router;
