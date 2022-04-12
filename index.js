const express = require('express');
const path = require('path');
const router = require("express").Router();
const cors = require("cors");
//const PORT = process.env.PORT || 5007 ;
var app = express(); 

require('dotenv').config();

app
  .use(cors()) 
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views')) 
  .get('/', (req, res) => {res.send("hi!!!");})
  .listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
 // .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  require("./routes/routes")(app);