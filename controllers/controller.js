const { response } = require('express');
const { Pool } = require('pg');
const { upperCase } = require('upper-case'); 
const crypto = require('crypto');
  
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
            rejectUnauthorized: false
        }
})

const listCmnt = (request,response)=>{
    var pagenumb = request.param('pagenumb');  
    var pagesize = 10;  
    
    console.log("pagenumb : " +pagenumb);

    if(request.param('pagesize')){
        pagesize = request.param('pagesize');
    }

    if(pagenumb){ 
        var pagestart = (((pagenumb -1) * pagesize) + 1);  
        
        if(pagestart <= 0){
            pagestart = 1;
        }

        var pageend = (pagestart + (pagesize - 1));
        
        console.log("list here (paging) pagenumb : " + pagenumb + " / pagesize : " + pagesize + " / pagestart : " + pagestart + " / pageend : " + pageend);  

        pool.query('SELECT a.* FROM (SELECT count(*) over() as totalcnt, row_number() over(order by cmntid desc), * FROM comment ) a '
                    + 'WHERE row_number BETWEEN $1 AND $2',[pagestart,pageend] , (err, result) => { 
            if (err) {
                return console.error('Error executing query', err.stack); 

                console.log(err);
                //result.status(400).send(err);
            }

            console.log(result); 
            response.send(result.rows); 
            
            // res.status(200).json(response.rows);
        });

    }else{
        console.log("list here (no paging)");
        pool.query('SELECT row_number() over(), a.* FROM (SELECT * FROM comment ORDER BY cmntid desc) a', (err, result) => {      
            if (err) {
                return console.error('Error executing query', err.stack);
                
                console.log(err);
                //result.status(400).send(err);
            }
            console.log(result);
             response.send(result.rows); 
            // res.status(200).json(response.rows);
        });
    } 
}

const addCmnt = (request,response)=>{
    //const {name, email} = req.body;
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntadddate = new Date();
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
    
    pool.query('INSERT INTO comment(cmnttext, cmntadddate, cmntpw) VALUES($1, $2, $3)',[cmnttext, cmntadddate, cmntpw]);
    console.log(response);
    response.status(200).json({
        message: 'Added Successfully',
        body:{
            comment:{cmnttext,cmntadddate}
        }
    });
};
     
const updateCmnt = (request,response)=>{
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntfixdate = new Date();
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
    
    //const id = req.params.id;
    //const {name, email} = req.body;

    response.json('do not use this api...(updateCmnt -> compareCmntPw)');
    
    /*
    pool.query('UPDATE comment SET cmnttext = $1, cmntfixdate = $2, cmntpw = $3 WHERE cmntid = $4',[cmnttext, cmntfixdate, cmntpw, cmntid]);
    console.log(response);
    response.json('updated successfully');
    */
};   

const deleteCmnt = (request,response)=>{
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntfixdate = new Date();
    var cmntpw = request.body["cmntpw"];

    response.json('do not use this api...(deleteCmnt -> compareCmntPw)');

    /*
    pool.query('DELETE FROM comment WHERE cmntid = $1',[cmntid]);
    console.log(response);
    //response.json(` ${cmntid} deleted successfully`);
    */
};
 
const compareCmntPw = (request,response)=>{
    var operation = request.body["operation"];
    var cmntid = request.body["cmntid"]; 
    var cmnttext = request.body["cmnttext"]; 
    var cmntfixdate = new Date();
    var cmntpw = crypto.createHash('sha512').update(request.body["cmntpw"]).digest('base64');  
    //var cmntpw = request.body["cmntpw"]; 
 
    pool.query('SELECT * FROM comment WHERE cmntid = $1 ',[cmntid],(err, result) => {   
        console.log("compareCmntPw select result : " + result);

        if (err) {
            return console.error('Error executing query', err);  
            console.log(err);
            //result.status(400).send(err);

        }else if(!result.rows[0]) {
            response.json("not matched data... check 'cmntid and cmntpw'"); 
            console.log('not matched data' + result.rows); 

        }else if(result.rows[0]) {  
            
            console.log('check pw.. cmntpw : ' + cmntpw + " / result.rows[0].cmntpw : " + result.rows[0].cmntpw); 
            if(result.rows[0].cmntpw == cmntpw){
                //console.log(result.rows); 

                if(upperCase(operation) == "U") {
                    pool.query('UPDATE comment SET cmnttext = $1, cmntfixdate = $2  WHERE cmntid = $3 and cmntpw = $4',[cmnttext, cmntfixdate, cmntid, cmntpw]);
                    console.log("U.rows.pw : " + result.rows[0].cmntpw );  
                    response.json(`cmntid ${cmntid} updated successfully`);

                }else if(upperCase(operation) == "D") {
                    pool.query('DELETE FROM comment WHERE cmntid = $1 and cmntpw = $2',[cmntid, cmntpw]);
                    console.log("D.rows.pw : " + result.rows[0].cmntpw ); 
                    response.json(` cmntid ${cmntid} deleted successfully`);
                }

            }else{  
                console.log("!= pw");
                response.send("!= pw"); 
                
            }
        }
        //console.log(result);
        //response.send(result.rows);
         

         // res.status(200).json(response.rows);
    }); 

};


const listCard = (request,response)=>{  
  
        pool.query('SELECT * FROM cardcount ORDER BY cardid asc', (err, result) => {      
            if (err) {
                return console.error('Error executing query', err.stack);
                
                console.log(err);
                //result.status(400).send(err);
            }
            console.log(result);
            response.send(result.rows); 
            // res.status(200).json(response.rows);
        });
    
}
 

const updateCard = (request,response)=>{ 
    var cardid = request.body["cardid"];    
    
    pool.query('SELECT * FROM cardcount WHERE cardid = $1 ORDER BY cardid asc',[cardid], (err, result) => {      
        if (err) {
            return console.error('Error executing query', err.stack);
            
            console.log(err);
            //result.status(400).send(err);
        } 

        pool.query('UPDATE cardcount SET cardcnt = $1 WHERE cardid = $2',[result.rows[0].cardcnt+1, cardid]);
                    console.log("cardcnt : " + (result.rows[0].cardcnt + 1));  
                    response.json(`cmntid ${cardid} updated successfully`);
 
    });
      
}

const maeilZero = (request,response)=>{

    response.download('./docs/zero_diary+sticker.zip', (err)=>{
        if (err) {
            console.log("zero_diary Error");
            console.log(err);
        } else {
            console.log("zero_diary Success");
        }
    });
}


module.exports = {
    listCmnt,
    addCmnt,
    updateCmnt,
    deleteCmnt,
    compareCmntPw,

    listCard,
    updateCard,
    
    maeilZero,

}