import User from "../model/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Post from "../model/post.model.js";
import { errorHandler } from "../utils/errorHandler.js";
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Find user by email and get the _id
        const userEmail = await Post.findOne({ email: email }, { projection: { _id: 1 } });

        // Check if userEmail is found
        if (!userEmail) {
            return next(errorHandler(400, 'Hey please enter correct email id which you have entered in previous form'));
        }

        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create new user with the yuvakId from userEmail
        const yuvakId = userEmail._id;
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            yuvakId
        });

        // Save the new user
        await newUser.save();
        res.json('signup successful');
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(400, 'Duplicate key error: email must be unique'));
        }
        next(error);
    }
}

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    if (
        !email ||
        !password ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400, 'All fields are required'));
      }
      try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(400,'Invalid Password'))
        }
        const token = jwt.sign({id:validUser._id,isAdmin: validUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass, ...rest}= validUser._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,

            }).json(rest)
      } catch (error) {
        next(error)
      }
}

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    // Find user by email and get the _id
    const userEmail = await Post.findOne({ email: email }, { projection: { _id: 1 } });

    // Check if userEmail is found
    if (!userEmail) {
      return next(errorHandler(400, 'Hey please enter correct email id which you have entered in previous form'));
    }

    const user = await User.findOne({ email });

    if (user) {
      // Generate a token for an existing user
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;  // Correct user document extraction
      res.status(201)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    } else {
      // Generate a new user with a random password
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const yuvakId = userEmail._id;
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        yuvakId
      });

      await newUser.save();

      // Generate a token for the new user
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;  // Correct new user document extraction

      res.status(201)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};