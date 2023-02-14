const express = require('express');
const cors = require('cors');
const UserModel = require('./models/user')
const connectDB = require('./db/connection')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const secret = 'sklfslkfjslflkjsalkfalfkjsalfk'
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const app = express();
app.use(cors({credentials : true, origin : 'http://localhost:3000'}))
app.use(express.json());
app.use(cookieParser());
// Registration

app.post('/register',async(req,res)=>{
try {
    const {username, password} = req.body;
    console.log(username, password)
    const request = await UserModel.create({username, 
        password : bcrypt.hashSync(password,salt)});
        res.status(201).json(request);
} catch (error) {
    res.status(500).json({msg : 'something went wrong'});
}
})

// Login
app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const request = await UserModel.findOne({username})
   if(request !== null){
    const passOk =  bcrypt.compareSync(password ,request.password)
    if(passOk){
        //login
        jwt.sign({username, id : request._id}, secret , {}, (err,token)=>{
            if( err) throw err;
            res.cookie('token',token).json({msg : 'valid user',username})
        })
    }
    else{
        res.status(400).json({msg : "Wrong Credentials"});
    }
   }
   else{
        res.status(400).json({msg : "Wrong Credentials"});
   }
})

// Profile checkting token
app.get('/profile',(req,res)=>{
    const {token} = req.cookies ;
    jwt.verify(token, secret,{},(err,info)=>{
        if(err) throw err;
        res.status(200).json(info)
    })
})


// logout 

app.post('/logout',(req,res)=>{
    res.cookie('token','').json({msg : 'success'})
})
const port = 5000;

const start  = async() =>{
    try{
        const url = 'mongodb+srv://suraj9318:1234@cluster0.oo6kxar.mongodb.net/blog?retryWrites=true&w=majority'
        await connectDB(url);
        app.listen(port,console.log(`server is listening on port ${port}...`))
    }catch(err){
        console.log("error")
        console.log(err)
    }
}
start();

// 