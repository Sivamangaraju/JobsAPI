const User=require('../models/User')
const {StatusCodes} =require('http-status-codes')
const {BadRequestError,UnauthenticatedError}=require('../errors')
const jwt=require('jsonwebtoken')

const register= async(req,res)=>
{
    const user=await User.create({...req.body})
    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login= async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError("Please provide email and password")
    }
    const user =await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPassCorrect= await user.comparePassword(password)
    if(!isPassCorrect){
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const token=user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})


}


//optional for delete entire data in User Model
const deleteData=async(req,res)=>{
    const user=await User.deleteMany({});
    res.status(200).json({msg:"success"})
}




module.exports={
    register,login,deleteData
}
