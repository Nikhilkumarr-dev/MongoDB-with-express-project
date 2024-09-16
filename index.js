const express =require("express")
const app=express();

const {UserModel,TodoMOdel, TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const JWT_SECRET="asssss";

mongoose.connect("mongodb+srv://admin:MU9Nw4YfueewntQW@cluster0.00ffj.mongodb.net/todo-app-Nikhil");

app.use(express.json());


app.post("/signup",async function(req,res)
{
    const email= req.body.email;
    const  password=req.body.password;
    const name=req.body.name;   

    await UserModel.create({
        email:email,
        password:password,
        name:name
    })

    res.json({
        message:"successfully signed in"
    })
})

app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email,
        password: password,
    });

    if (response) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});

app.post("/todo",auth,async function(req,res)
{
   const userId=req.userId;
   const title=req.body.title;
   const done = req.body.done;

   await TodoModel.create({
    userId,
    title,
    done
   });

   res.json({
    message:"Todo created Successfully"
   })
})

app.post("/todos",auth,async function(req,res){

    const userId=req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    });
});

function auth(req,res,next){
    const token = req.headers.token;
    const decodedData=jwt.verify(token,JWT_SECRET);
    if(decodedData)
    {
        req.userId=decodedData.id;
        next();
    }else
    {
        res.status(403).json({
            message:"incorrect credentials"
        })
    }
}
app.listen(2014);