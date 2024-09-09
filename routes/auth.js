
const express=require('express')
const router=express.Router();

const {login,register,deleteData}=require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/delete').delete(deleteData)


module.exports=router