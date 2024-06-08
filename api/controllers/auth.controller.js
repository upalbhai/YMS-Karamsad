import User from "../model/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/errorHandler.js";
export const signup =async(req,res,next)=>{
    const {username,email,password} = req.body;
    
    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400, 'All fields are required'));
      }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        password:hashedPassword,
        email
    })
    
    try {
        await newUser.save();
        res.json('signup successfull')
    } catch (error) {
        next(error)
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

      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      // Generate a token for the new user
      const token = jwt.sign({ id: newUser._id,isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;  // Correct new user document extraction

      res.status(201)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
