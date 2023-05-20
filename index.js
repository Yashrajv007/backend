
require('./Config/db')
const app=require('express')();
const port =process.env.PORT;

const UserRouter=require('./Api/User')


const bodyParser=require('express').json;
app.use(bodyParser());

app.get("/",(req,res)=>{
    res.send("hello there");
})

app.use('/user',UserRouter); 

app.listen(port,()=>{
    console.log(`server running on port  http://localhost:${port}`);
})
