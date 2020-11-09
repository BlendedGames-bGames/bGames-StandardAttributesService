const express = require('express');
const router = express.Router();

var http = require('http');
const qs = require('querystring');

var common = require('./extras');
const fetch = require('node-fetch');


// PARA ESTE MICROSERVICIO SE NECESITA INGRESAR LOS DATOS DE LA SIGUIENTE MANERA:
/* Ejemplo de Json del Body para el POST
    {
    "id_player": 2,
    "nameat": "Resistencia",
    "namecategory": "Físico",
    "data": 1,
    "data_type": "in.off",
    "input_source": "xlr8_podometer",
    "date_time": "2019-05-16 13:17:17"
    }
*/

/*
Input:  Json of sensor data
Output: Void (stores the data in the db)
Description: Calls the b-Games-ApirestPostAtt service 
*/
router.post('/StandardAttributes/', (req,res,next)=>{
    var post_data = req.body;
    if(!req.body.id_player || !req.body.id_player|| !req.body.nameat|| !req.body.namecategory|| !req.body.data|| !req.body.data_type|| !req.body.input_source|| !req.body.date_time){
        return res.sendStatus(400).json({
            error: 'Missing data'
          })
    }
    console.log(post_data);
    var id_player = Number(post_data.id_player);
    var nameat = post_data.nameat;
    var namecategory = post_data.namecategory;
    var dat = Number(post_data.data);
    var data_type = post_data.data_type;
    var input_source = post_data.input_source;
    var date_time = post_data.date_time;

    
    const data2 = JSON.stringify({
        id_player: id_player,
        nameat:nameat,
        namecategory:namecategory,
        data:dat,
        data_type:data_type,
        input_source:input_source,
        date_time:date_time
      })

    console.log(data2);

    var options = {
        host : 'bgames-apirestpostatt.herokuapp.com',
        path: ('/attributes/'),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data2),
          }
    };

    var data = 
    {
            id_player: Number(post_data.id_player),
            nameat: post_data.nameat,
            namecategory: post_data.namecategory,
            dat: Number(post_data.data),
            data_type: post_data.data_type,
            input_source: post_data.input_source,
            date_time:post_data.date_time
    };

    var url = "http://"+options.host + ":"+ options.port + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;

    const response = fetch(MEDIUM_POST_URL, {
        method: "post",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
            },
            body: JSON.stringify({
                id_player: id_player,
                nameat:nameat,
                namecategory:namecategory,
                data:dat,
                data_type:data_type,
                input_source:input_source,
                date_time:date_time
              })
    })
    .then(res => res.json())
    .then(json => console.log("Response of API: "+json));

    const messageData = response;

    // the API frequently returns 201
    if ((response.status !== 200) && (response.status !== 201)) {
        console.error(`Invalid response status ${ response.status }.`);
        throw messageData;
    }else{

    }

})

/*
Input: Id of a player (range 0 to positive int)
Output: Void (edits a player's info)
Description: Calls the b-Games-ConfiguratioService service to edit the info of a specific player
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
        const data2 = JSON.stringify({
            name: name,
            pass:pass,
            age:age
          });
        console.log("cuanto es2: "+data2);
        
        var options = {
            host : 'bgames-configurationservice.herokuapp.com',
            path: ('/players/'+id),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data2.length
              }
        };
        common.getJsonSend(options,data2,function(err,result){
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

