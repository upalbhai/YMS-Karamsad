import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import path from 'path';

dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser())
mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("Database connection successfull")
}).catch((err)=>{
    console.log(err)
})
app.listen(3000,(req,res)=>{
    console.log('Server running on 3000')
})


// routes
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)
// app.use('/api/comment',commentRoutes)

//for render
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


//middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})