const express = require('express');
const router = express.Router();
const{saveProfile,editProfile}= require('../controllers/profileController')

router.patch('/saveProfile',saveProfile)
router.patch('/editProfile/',editProfile)

module.exports = router;