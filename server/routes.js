const express=require('express')
const router=express.Router()
const authcontrollers =require('./authcontroller')

router.route('/feed').post(authcontrollers.validate);

module.exports=router