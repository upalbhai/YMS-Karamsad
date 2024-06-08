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
    },
    bloodGroup:{
        type:String,
        required:true,
    },
    parentNumber: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v);
          },
          message: props => `${props.value} is not a valid 10-digit phone number!`
        }
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
    age:{
        type:Number,
        required:true,
    },
    education:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);
export default Post;