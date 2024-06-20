import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';

import { createPost, deletePost, getPosts,getPost, updatePost } from '../controllers/post.controller.js';
const router = express.Router();
router.post('/createpost',createPost)
router.get('/getposts',getPosts)
router.get('/getpost/:postId',getPost)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)
router.put('/updatepost/:postId/:userId',verifyToken,updatePost)
export default router;