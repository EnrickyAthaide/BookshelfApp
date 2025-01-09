const moongoose = require('mongoose')
moongoose.connect("mongodb://127.0.0.1:27017/bookshelf")

userSchema=moongoose.Schema({
    name:String,
    email:String,
    age:Number,
    address:String,
    password:String,
})

model=moongoose.model('user',userSchema)
module.exports=model