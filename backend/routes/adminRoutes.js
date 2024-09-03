const express = require("express");
const {getUsers,deleteUser} = require('../controllers/adminController');
const router = express.Router();

router.get('/getUsers',getUsers)
router.delete('/deleteUser/:userId',deleteUser);

module.exports = router; 