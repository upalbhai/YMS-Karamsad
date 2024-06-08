// import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { errorHandler } from "../utils/errorHandler.js"
export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.name || !req.body.address || !req.body.pNumber || !req.body.age) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  if (!/^\d{10}$/.test(req.body.pNumber)) {
    return next(errorHandler(403,'Lasan Enter phone number of 10 digits'));
  }
  
  const slug = req.body.name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};


//get posts
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
    res.status(500).json({ message: 'Server Error', error: error.message });
    next(error);
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


export const updatePost = async(req,res,next)=>{
  if(!req.user.isAdmin ||  req.user._id !== req.user.userId){
    return next(errorHandler(403,'You are not allow to edit this post'))
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
      {
        $set:{
          name:req.body.name,
          address:req.body.address,
          image:req.body.image,
          pNumer:req.body.pNumber,
          education:req.body.education,
        },
      },{new:true}
    )
    res.status(200).json(updatedPost)
  } catch (error) {
    next(error)
  }
}