// import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/errorHandler.js"
export const createPost = async (req, res, next) => {
  // Validate required fields
  const { name, address, bloodGroup, pNumber, age } = req.body;
  
  if (!name || !address || !bloodGroup || !pNumber || !age) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // // Validate phone number format
  // if (!/^\d{10}$/.test(pNumber)) {
  //   return next(errorHandler(403, 'Please enter a phone number of 10 digits'));
  // }

  // Create slug from the name
  const slug = name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  // Create a new post object
  const newPost = new Post({
    ...req.body,
    slug,
  });

  try {
    // Save the post to the database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};



//get posts// getPosts
export const getPosts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      // Build the query object
      const query = {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.pNumber && { pNumber: req.query.pNumber }),
        ...(req.query.name && { name: req.query.name }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { name: { $regex: req.query.searchTerm, $options: 'i' } },
            { address: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      };
  
      const posts = await Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments(query);
  
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  };
  
export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    // await Comment.deleteMany({postId:req.params.postId})
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const post_id = req.params.postId;
  const user_id = req.params.userId;
console.log(post_id)
console.log(user_id)
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    // Fetch the user who is trying to update the post
    const user = await User.findById(user_id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check if the user is not an admin and their yuvakId does not match the post's _id
    if (!req.user.isAdmin && user.yuvakId.toString() !== post._id.toString()) {
      return next(errorHandler(403, 'You are not allowed to edit this post'));
    }
    // Validate phone number format
    if (!/^\d{12}$/.test(req.body.pNumber)) {
      return next(errorHandler(403, 'Please enter a phone number of 10 digits'));
    }
    if (!/^\d{12}$/.test(req.body.parentNumber)) {
      return next(errorHandler(403, 'Please enter parent phone number of 10 digits'));
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          image: req.body.image,
          pNumber: req.body.pNumber,
          education: req.body.education,
          parentNumber: req.body.parentNumber,
          bloodGroup: req.body.bloodGroup,
          country:req.body.country,
          state:req.body.state,
          birthDate:req.body.birthDate,
        },
      },
      { new: true }
    );

    // Return the updated post as JSON response
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};


export const getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const getPost = await Post.findById(postId);
    if (!getPost) {
      return next(errorHandler(404, 'Post not found'));
    }
    res.status(200).json(getPost);
  } catch (error) {
    next(error);
  }
};