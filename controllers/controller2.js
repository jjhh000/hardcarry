const { response } = require('express');
const { Pool } = require('pg'); 
const crypto = require('crypto');
  
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
            rejectUnauthorized: false
        }
})


const getCmnts = (request,response)=>{
    var pagenumb = request.params.pagenumb;  
    var pagesize = 10;  
    
    console.log("pagenumb : " +pagenumb);

    if(request.param('pagesize')){
        pagesize = request.param('pagesize');
    }
 
        var pagestart = (((pagenumb -1) * pagesize) + 1);  
        
        if(pagestart <= 0){
            pagestart = 1;
        }

        var pageend = (pagestart + (pagesize - 1));
        
        console.log("list here (paging) pagenumb : " + pagenumb + " / pagesize : " + pagesize + " / pagestart : " + pagestart + " / pageend : " + pageend);  

        pool.query('SELECT a.* FROM (SELECT count(*) over() as totalcnt, row_number() over(order by cmntid desc), * FROM comment ) a '
                    + 'WHERE row_number BETWEEN $1 AND $2',[pagestart,pageend] , (err, result) => { 
            if (err) {
                response.status(500).send(err);
                return console.error('Error executing query', err.stack);  
            }

            console.log(result); 
            response.status(200).json(result.rows);  
        }); 
}


const createCmnt = (request,response)=>{
    //const {name, email} = req.body;
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntadddate = new Date();
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
    
    pool.query('INSERT INTO comment(cmnttext, cmntadddate, cmntpw) VALUES($1, $2, $3)',[cmnttext, cmntadddate, cmntpw]);
    console.log(response);
    response.status(200).json({
        message: 'Added Successfully'  
    });
};
 
async function updateCmnt(request,response){
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntfixdate = new Date();
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
 
    pool.query('SELECT * FROM comment WHERE cmntid = $1 ',[cmntid],(err, result) => {   
        console.log('check pw.. cmntpw : ' + cmntpw + " / result.rows[0].cmntpw : " + result.rows[0].cmntpw); 

        if (err) {
            response.status(500).send(err);
            return console.error('Error executing query', err.stack); 
     
        }else if(!result.rows[0]) {
            response.status(404).json({
                message: `check 'cmntid(${cmntid})`}); 
            console.log("deleteCmnt, check 'cmntid'"); 

        }else if(result.rows[0]) {
            if(result.rows[0].cmntpw == cmntpw){
                pool.query('UPDATE comment SET cmnttext = $1, cmntfixdate = $2  WHERE cmntid = $3 and cmntpw = $4'
                            ,[cmnttext, cmntfixdate, cmntid, cmntpw]);
                response.json(`cmntid ${cmntid} updated successfully`);
                                 
            }else{  
                response.status(400).json({
                    message: "req.pw != db.pw"});
                console.log("deleteCmnt, req.pw != db.pw");
                
            }
        } 
    });
};


const deleteCmnt = (request,response)=>{
    var cmntid = request.body["cmntid"];
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
 
    pool.query('SELECT * FROM comment WHERE cmntid = $1 ',[cmntid],(err, result) => {   
        console.log('check pw.. cmntpw : ' + cmntpw + " / result.rows[0].cmntpw : " + result.rows[0].cmntpw); 

        if (err) {
            response.status(500).send(err);
            return console.error('Error executing query', err.stack); 
     
        }else if(!result.rows[0]) {
            response.status(404).json({
                message: `check 'cmntid(${cmntid})`}); 
            console.log("deleteCmnt, check 'cmntid'"); 

        }else if(result.rows[0]) {
            if(result.rows[0].cmntpw == cmntpw){
                pool.query('DELETE FROM comment WHERE cmntid = $1 and cmntpw = $2',[cmntid, cmntpw]);

                response.json(`cmntid ${cmntid} deleted successfully`);
                 
            }else{  
                response.status(400).json({
                    message: "req.pw != db.pw"});
                console.log("deleteCmnt, req.pw != db.pw");
                
            }
        } 
    });
};
   

const zeroDiary = (request,response)=>{

    response.download('./public/zero_diary+sticker.zip', (err)=>{
        if (err) {
            console.log("zero_diary Error");
            console.log(err);
        } else {
            console.log("zero_diary Success");
        }
    });
}


module.exports = {
    getCmnts,
    createCmnt,
    updateCmnt,
    deleteCmnt,

    zeroDiary,

}