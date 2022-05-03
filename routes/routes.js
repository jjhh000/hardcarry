const router = require("express").Router();
const api = require("../controllers/controller"); 
const api2 = require("../controllers/controller2");


var bodyParser = require('body-parser'); 

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


module.exports = app =>{
    //api v1
    router.get("/listCmnt",api.listCmnt);
    router.post("/addCmnt",api.addCmnt);
    router.post("/updateCmnt",api.updateCmnt);
    router.post("/deleteCmnt",api.deleteCmnt);
    router.post("/compareCmntPw",api.compareCmntPw); 
    
    router.get("/listCard",api.listCard);
    router.post("/updateCard",api.updateCard);
    
    router.get("/maeilZero",api.maeilZero);
    
    //api v2
    router.get("/v2/comments/:pagenumb/:pagesize",api2.getCmnts);
    router.post("/v2/comments",api2.createCmnt);
    router.put("/v2/comments",api2.updateCmnt);
    router.delete("/v2/comments",api2.deleteCmnt);

    router.get("/v2/zeroDiary",api2.zeroDiary);
    

    app.use('/hardcarry',router);
   }