require("dotenv").config();
const { Users, AnimeFavorites } = require("../../db");
import { googleVerify } from "../../helpers/google-verify";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = Number(process.env.SALT_ROUNDS);
const secret = process.env.SECRET_WORD;
const salt = bcrypt.genSaltSync(saltRounds);

export const signUp = async (obj) => {
  const { username, email, pass, image, google } = obj;
  let isAdmin = false;

  if (!username || !email || !pass)
    throw "Missing data require to create a new user";

  if (
    email === "jhojangutierrez900@gmail.com" ||
    email === "xdarcx@hotmail.es" ||
    email === "p.manolaki95@gmail.com" ||
    email === "sam.caillat@gmail.com" ||
    email === "enzoholgadocdb@gmail.com"
  ) {
    isAdmin = true;
  }

  const userExist = await Users.findOne({ where: { username } });
  const emailExist = await Users.findOne({ where: { email } });
  // const userGoogle = await Users.findOne({ where: { email } });
  if (userExist === null && emailExist === null) {
    const password = bcrypt.hashSync(pass, salt);
    const user = await Users.create({
      username,
      email,
      password,
      isAdmin,
      image,
      google,
    });

    const token = jwt.sign({ user }, secret, { expiresIn: "1h" });

    return { user, token, msg: "you have successfully registered" };
  } else if (userExist === null && emailExist.google === true) {
    throw "you need to log in with google, your count already exists";
  } else if (userExist === null && emailExist)
    throw "this email is already registered";
  else if (userExist) throw "This username is not available";
};

export const signIn = async (obj) => {
  const { email, password } = obj;
  const user = await Users.findOne({
    where: { email },
  });

  // if(!user.isActive) {
  //   throw 'talk to admin, user blocked'
  // }
  if (!user) {
    throw "User with this email not found";
  } else if (!user.isActive) {
    throw "talk to admin, user blocked";
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ user }, secret, { expiresIn: "1h" });
      return { msg: "The user has been authenticated", user, token };
    } else {
      throw "Invalid password!!";
    }
  }
};

export const getAllUsers = async () => {
  const allUsers = await Users.findAll({
    include: { model: AnimeFavorites },
  });
  return allUsers;
};

export const getUserEmail = async (email) => {
  const user = await Users.findOne({
    where: { email },
    include: [{ model: AnimeFavorites }, { model: MangaFavorites }],
  });
  return user;
};

export const googleSignIn = async (id_token) => {
  if (id_token) {
    let isAdmin = false;
    try {
      const googleUser = await googleVerify(id_token);
      const { name, picture, email } = googleUser;

      if (
        email === "jhojangutierrez900@gmail.com" ||
        email === "xdarcx@hotmail.es" ||
        email === "p.manolaki95@gmail.com" ||
        email === "sam.caillat@gmail.com" ||
        email === "enzoholgadocdb@gmail.com"
      ) {
        isAdmin = true;
      }

      let user = await Users.findOne({ where: { email } });

      if (!user) {
        let data = {
          username: name,
          email,
          image: picture,
          pass: ":p",
          google: true,
          isAdmin,
        };
        await Users.create(data);
        user = await Users.findOne({ where: { email } });
      }
      if (!user.isActive) {
        throw "talk to admin, user blocked";
      }

      const token = jwt.sign({ user }, secret, { expiresIn: "1h" });

      return {
        msg: "user authenticated successfully with Google",
        user,
        token,
      };
    } catch (error) {
      return { msg: "token cannot be verified", error };
    }
  } else return { msg: "id_token is necessary" };
};

///-----ruta putUser http://localhost:3000/login/${email}

export const putUser = async (req, res) => {
  try {
    let email = req.params.email;
    let { username, image, cellphone } = req.body;
    let resDB = await Users.update(
      { username, image, cellphone },
      {
        where: {
          email,
        },
      }
    );

    res.send(resDB);
  } catch (error) {
    res.status(400).send("User not update!!");
  }
};

///-----ruta bannearUser http://localhost:3000/login/${id}

export const bannearUser = async (req, res) => {
  try {
    let id = req.params.id;
    let { isAdmin, isActive } = req.body;
    if (isAdmin === true) {
      let resDB = await Users.update(
        { isActive },
        {
          where: {
            id,
          },
        }
      );
    }

    res.send("User baneado");
  } catch (error) {
    res.status(400).send("User not baneado!!");
  }
};
