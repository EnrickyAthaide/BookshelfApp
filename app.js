const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const path = require('path')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userModel=require('./models/users')

app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,"public"))) 
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get("/" , (req,res)=>{
    res.render("index")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/register",async (req,res)=>{
    const {name,email,age,address,password}=req.body
    const newuser=await userModel.findOne({email})
    if (newuser){
        return res.status(400).send({message:"user already exist"})
    }
    bcrypt.genSalt(10,(err,salt)=>{ 
        bcrypt.hash(password,salt,async (err,hash)=>{
           const userData= await userModel.create({
                name,
                email,
                age,
                address,
                password:hash
            })
           const token=jwt.sign({email,id:userData._id },"KisKOMatBatana")
           res.cookie("token",token)
           res.redirect("login")
        })
    })
})

app.post("/login",async (req,res)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if (!user){
        return res.status(400).send("something went wrong")
    }
    bcrypt.compare(password,user.password,(err,result)=>{
        if (result){
            const token=jwt.sign({email,id:user._id },"KisKOMatBatana")
            res.cookie("token",token)
            res.redirect("/profile")
        }
        else{
            res.status(400).send("Invalid password")
        }
    })

})

app.get("/profile",isloggedin,async(req,res)=>{
    const user= await userModel.findOne({email:req.user.email})
    console.log(user)
    res.render("profile")
})

app.get("/logout",(req,res)=>{
    res.cookie("token","") 
    res.redirect("/")
})

function isloggedin(req,res,next){
  if (req.cookies.token==""){
    res.redirect("/login")
  }
  else{
    const token=req.cookies.token
    const data=jwt.verify(token,"KisKOMatBatana")
    req.user=data
    next()
  }
}
app.listen(3000)