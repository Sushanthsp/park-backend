const express = require("express");
const router = express.Router();
const userRouter = require("./user/router/router");

router.get('/test',(req,res) =>{
    res.send("I'm asleep")
})

router.use("/user", userRouter);

module.exports = router