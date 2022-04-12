const router = require("express").Router();
const api = require("../controllers/controller");


var bodyParser = require('body-parser'); 

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


module.exports = app =>{
    router.get("/listCmnt",api.listCmnt);
    router.post("/addCmnt",api.addCmnt);
    router.post("/updateCmnt",api.updateCmnt);
    router.post("/deleteCmnt",api.deleteCmnt);
    router.post("/compareCmntPw",api.compareCmntPw);
     
    
 

    app.use('/hardcarry',router);
}