const express = require("express");
const router = express.Router();

router.get("/create", (req, res) => {
    res.render('createreview');
})




router.get("/edit", (req, res) => {
    res.render('editreview');
})





module.exports = router;