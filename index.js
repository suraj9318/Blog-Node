const express = require('express');
const cors = require('cors');
const UserModel = require('./models/user')
const connectDB = require('./db/connection')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const secret = 'sklfslkfjslflkjsalkfalfkjsalfk'
const jwt = require('jsonwebtoken')

const app = express();
app.use(cors())
app.use(express.json())



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


app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const request = await UserModel.findOne({username})
   if(request !== null){
    const passOk =  bcrypt.compareSync(password ,request.password)
    if(passOk){
        //login
        jwt.sign({username, id : request._id}, secret , {}, (err,token)=>{
            if( err) throw err;
            res.cookie('token',token).json({msg : 'valid user'})
        })
    }
    else{
        res.status(200).json({msg : "Wrong Credentials"});
    }
   }
   else{
        res.status(200).json({msg : "Wrong Credentials"});
   }
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