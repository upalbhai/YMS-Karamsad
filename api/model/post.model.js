import mongoose from 'mongoose';
import User from './user.model.js';
const postSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    address:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    bloodGroup:{
        type:String,
        required:true,
    },
    email: { type: String, required: true, unique: true }, 
    parentNumber: {
        type: String,
        required: true,
      },
    image:{
        type:String,
        default:'https://images.app.goo.gl/qXNeL39HFsaHAvgMA'
    },
    yuvakId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slug: {
        type: String,
        required: true,
        unique: true,
      },
    pNumber:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    education:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    birthDate:{
        type:String,
        required:true,
    },
 
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);
export default Post;