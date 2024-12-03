const express=require('express')
const router=express.Router()
const authcontrollers =require('./authcontroller')

router.route('/validate').post(authcontrollers.validate);

module.exports=router