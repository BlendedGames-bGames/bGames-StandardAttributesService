const express = require('express');
const router = express.Router();

var http = require('http');

var common = require('./extras');



/*
Input: Id of a player (range 0 to positive int)
Output: Resume of attributes of that player
Description: Calls the b-Games-ConfigurationService service to get the name, pass and age of that player
*/
router.get('/PlayerConfig/:id', (req,res,next)=>{
    var post_data = req.body;
    const{id}= req.params;
    var options = {
        host : 'bgames-configurationservice.herokuapp.com',
        path: ('/players/'+id),
        method: 'GET'
      };
    common.getJson(options,function(err,result){
        if(err){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error in user config: get");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})

//Faltan todos los verificadores de si cumple con los requerimientos o faltan datos!
/*
Input: Id of a player (range 0 to positive int)
Output: Resume of attributes of that player
Description: Calls the b-Games-Configuration service to edit the info of a specific player
*/

router.put('/PlayerConfig/edit/:id', (req,res,next)=>{
    //var headersIN = req.body;
    const headersIN = JSON.stringify(req.body);
    const {name,pass,age} = req.body;
    const{id}= req.params;
    console.log("cuanto es: "+headersIN);
    if ( !common.isNumber(Number(id)) || !common.isString(name) || !common.isString(pass) || !(common.isNumber(age))){
        console.log('This is not a player'+  typeof(Number(id)) + common.isString(name) + common.isString(pass) + common.isNumber(age));
        res.json("Error in user config: not user");
    }
    else{
        const data = JSON.stringify({
            name: name,
            pass:pass,
            age:age
          });
        console.log("cuanto es2: "+data);
        
        var options = {
            host : 'bgames-configurationservice.herokuapp.com',
            path: ('/players/'+id),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              }
        };
        common.getJsonSend(options,data,function(err,result){
            if(err){
                console.log("No hay resultado");//ACA ESTA EL RESULTADO
                res.json("Error in user config: get");
            }
            else{
                console.log(result);//ACA ESTA EL RESULTADO
                res.json(result);
            }
        });
    }

})


module.exports = router;

