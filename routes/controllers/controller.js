const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL|| 'postgres://xfgmmxplomltza:16e6916be0d5dca9d31755ebf78795bb33ac117329912f6c9e6946f66e95a2f7@ec2-3-230-122-20.compute-1.amazonaws.com:5432/dcnefjom3hnb5s',
    ssl: { rejectUnauthorized: false }
})

const listCmnt = (request,response)=>{
    
   // response.send('제발제발'); 
     
    pool.query('SELECT * FROM comment', (err, result) => {      
        if (err) {
            return console.error('Error executing query', err.stack);
            console.log(err);
            
            console.log(err);
            //result.status(400).send(err);
        }
        console.log(result);
        response.send(result.rows); 
        // res.status(200).json(response.rows);
    });
}

const addCmnt = (request,response)=>{
    //const {name, email} = req.body;
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntdate = request.body["cmntdate"];
    
    pool.query('INSERT INTO comment(cmnttext, cmntdate) VALUES($1, $2)',[cmnttext, cmntdate]);
    console.log(response);
    response.json({
        message: 'Added Successfully',
        body:{
            user:{cmnttext,cmntdate}
        }
    });
};
     
const updateCmnt = (request,response)=>{
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntdate = request.body["cmntdate"];
    //const id = req.params.id;
    //const {name, email} = req.body;
    
    pool.query('UPDATE comment SET cmnttext = $1, cmntdate=$2 WHERE id = $3',[cmnttext, cmntdate, cmntid]);
    console.log(response);
    response.json('updated successfully');
};   

const deleteCmnt = (request,response)=>{
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntdate = request.body["cmntdate"];

    pool.query('DELETE FROM comment WHERE cmntid = $1',[cmntid]);
    console.log(response);
    response.json(` ${cmntid} deleted successfully`);
};
   
 
 
module.exports = {
    listCmnt,
    addCmnt,
    updateCmnt,
    deleteCmnt,

}