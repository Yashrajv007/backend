const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});

const MONGODB_URI=process.env.DATABASE;
mongoose.connect(MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>{
            console.log('DB connected');
        })
        .catch((err)=>console.log(err));

