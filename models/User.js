const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
//require('dotenv')
require('dotenv').config();
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlegth:4,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'Please provide Email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlegth:6
    },
})

userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.createJWT=function()
{
    const token =jwt.sign(
        {userId: this._id,name:this.name},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )
    return token
}

userSchema.methods.comparePassword= async function(passKey)
{
    const isMatch= await bcrypt.compare(passKey,this.password)
    return isMatch

}

module.exports=mongoose.model('User',userSchema)