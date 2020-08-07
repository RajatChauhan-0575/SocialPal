const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/', homeController.home);
router.use('/users', require('./users')); 

//For any further routes, access from here:
//router.use('/routerName', require('./routerFile'));

module.exports = router;