import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:'https://images.app.goo.gl/qXNeL39HFsaHAvgMA'
    },
    slug: {
        type: String,
        required: true,
        unique: true,
      },
    pNumber:{
        type:Number,
    },
    education:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);
export default Post;