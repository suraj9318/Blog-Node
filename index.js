const express = require('express');
const cors = require('cors');
const UserModel = require('./models/user')
const connectDB = require('./db/connection')



const app = express();
app.use(cors())
app.use(express.json())



app.post('/register',async(req,res)=>{
try {
    const request = await UserModel.create(req.body);
    res.status(201).json(request);
} catch (error) {
    res.status(500).json({msg : 'something went wrong'});
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