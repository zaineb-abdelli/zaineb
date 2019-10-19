
//REST API will use Express.js framework
const express = require ('express');
const app=express();

//Enable Cross-Origin Resource Sharing
const cors = require("cors");
app.use(cors());

const weather = require('./Service/weather.js')
const irrigationState = require('./Service/irrigationState.js')


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/config', { useNewUrlParser: true }, function(err) {
    if (err) { throw err; }
    console.log("connection succeeded!");
});

// Création du schéma pour les données
var sensor_values = new mongoose.Schema({
    _id: { type : String },
    node_id : {type: Number},
    node_requirement : {type :Number},
    present_moinsture : {type :Number},
    date : { type : Date, default : Date.now },
    rang : { type :Number}
});

var sensor_model = mongoose.model('humidity', sensor_values);

let results;
results = [];

function sleep( millisecondsToWait ) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + millisecondsToWait){}
}
for (var j = 1; j < 5; j++) {
    var query = sensor_model.find(null);
    query.where('rang', j).limit(1);
    query.exec(function (err, comms) {
        if (err) {
            throw err;
        }
        comm = comms[0];
        console.log('id: ' + comm._id);
        console.log('node_id: ' + comm.node_id);
        console.log('Date : ' + comm.date);
        console.log('node_requirement: ' + comm.node_requirement);
        console.log('present_moinsture: ' + comm.present_moinsture);
        console.log('------------------------------');
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(time);

        results = [comm.node_id, comm.date, comm.node_requirement, comm.present_moinsture];
        console.log(results);
        app.get('/',(req,res)=>{
            try{
                res.json(results);
                console.log("controller",results);
            }
            catch(error)
            {
                console.log(error);
            }
        });
        app.get('/state',function(req,res) {
             irrigationState.getDecision(results[2], results[3], wheatherState).then((result) => {
                 res.json(result);
                console.log(result);
            })
        });

        mongoose.connection.close();
        sleep(10000);
    });

}

const server_Port=5000;
    var wheatherState;

app.get('/weather',(req,res)=>{
    try{
        //let {CurrentPage}=req.params;
        weather.weatherData().then((result)=>{
        res.json(result);
        wheatherState=result.list[0].weather[0].main;
        console.log("plz",wheatherState);
        });

    }
    catch(error)
    {
        console.log(error);
    }
});


//Listen to the defined port 
app.listen(server_Port, () => console.log(`Server started on port ${server_Port}`));
