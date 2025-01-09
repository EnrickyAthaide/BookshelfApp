const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const path = require('path')

app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,"public"))) 
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get("/" , (req,res)=>{
    res.send("hello world")
})

app.listen(3000)