const { Router } = require("express");
const SingUpRouter = Router();
const SingUpController = require("../controller/SingUpController")

SingUpRouter.get("/", (req, res) => {
  res.render("index");
});
SingUpRouter.get("/SingUp",(req,res)=>{
  res.render("SingUpForm");
})
SingUpRouter.post("/SingUp",SingUpController.GetUsers);

module.exports = SingUpRouter;
