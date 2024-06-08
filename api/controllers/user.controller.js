// import Comment from "../model/comment.model.js"
// import Post from "../model/post.model.js"
import User from "../model/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import bcrypt from 'bcryptjs'
export const test = (req,res)=>{
    res.json({message:"Api isn working"})
}

export const updateuser = async (req, res, next) => {
    try {
      if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
      }
  
      const updates = {};
  
      // Check and validate password
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return next(errorHandler(400, 'Password must be a minimum length of 6 characters'));
        }
        updates.password = await bcrypt.hash(req.body.password, 10);
      }
  
      // Check and validate username
      if (req.body.username) {
        const username = req.body.username;
        if (username.length < 7 || username.length > 20) {
          return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (username.includes(' ')) {
          return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (username !== username.toLowerCase()) {
          return next(errorHandler(400, 'Username must be in lowercase'));
        }
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
          return next(errorHandler(400, 'Username must contain only letters and numbers'));
        }
        updates.username = username;
      }
  
      // Check and add other updatable fields
      if (req.body.email) updates.email = req.body.email;
      if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;
  
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: updates },
        { new: true }
      );
  
      if (!updatedUser) {
        return next(errorHandler(404, 'User not found'));
      }
  
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
  
    try {
      const userId = req.params.userId;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Delete the user
      await User.findByIdAndDelete(userId);
  
      // Delete posts created by the user
    //   await Post.deleteMany({ userId });
  
      // Delete comments created by the user
    //   await Comment.deleteMany({ userId });
  
      res.status(200).json('User, their posts, and comments have been deleted');
    } catch (error) {
      next(error);
    }
  };
  
  

  export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
  };

  export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUsers = await User.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteUserByAdmin = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
  
    try {
      const deletingUser = await User.findById(req.params.userId);
      if (!deletingUser) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Prevent an admin from deleting another admin
      if (deletingUser.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to delete an admin'));
      }
  
      // Proceed with deletion if checks pass
      await User.findByIdAndDelete(req.params.userId);
    //   await Comment.deleteMany({userId:req.params.userId});
  
      // Delete posts created by the user
    //   await Post.deleteMany({ createdBy: req.params.userId });
    //   await Comment.deleteMany({userId:req.params.userId});
      res.status(200).json('User and their posts have been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const getUser = async(req,res,next)=>{
    try {
      const user = await User.findById(req.params.userId);
      if(!user){
        return(next(errorHandler(404,'User not found')))
      }
      const{password,...rest} = user._doc;
      res.status(201).json(rest) 
    } catch (error) {
      next(error)
    }

  }