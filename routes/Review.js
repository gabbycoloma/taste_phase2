const express = require("express");
const router = express.Router();
const server = require('../server');

router.get("/create", (req, res) => {
    res.render('createreview');
})



module.exports = router;