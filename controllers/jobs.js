const Job=require('../models/Job')
const {StatusCodes}= require('http-status-codes')
const {BadRequestError,UnauthenticatedError,NotFoundError}=require('../errors')



const getAllJobs= async(req,res)=>{
    const jobs= await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({name: req.user.name,jobs,count: jobs.length})

}

const getJob= async(req,res)=>{
    const {user:{userId},params:{id:jobId}}=req

    const job = await Job.findOne({
        _id:jobId,createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No Job with this id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})

}

const createJob= async(req,res)=>
{
    //req.user is coming from authentication file
    req.body.createdBy=req.user.userId
    const job= await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({name: req.user.name,job})
     
}

const updateJob= async(req,res)=>{
    const { body:{company,position},
            user:{userId,name},
            params:{id:jobId}
                        }=req
    
    if (company==="" || position===""){
        throw new BadRequestError('Company or position fields cannot be null')
    }
    const job= await Job.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,
        runValidators:true
    })
    if(!job){
        throw new NotFoundError(`No Job with this id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({name:name,job})
}

const deleteJob= async(req,res)=>{
    const {
        user:{userId},
        params:{id:jobId}
    } =req
    const job = await Job.findOneAndDelete({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError(`No Job with this id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({suceess:true})
    //res.send('delete job')   
}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}


