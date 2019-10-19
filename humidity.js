
const express = require ('express');
const app=express();

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
    weather_code: {type : Number},
    date : { type : Date, default : Date.now },
    rang : { type :Number}
});

var sensor_model = mongoose.model('humidity', sensor_values);
// On crée une instance du Model

var monCommentaire = new sensor_model({_id: "fffrrr"});
monCommentaire.node_id = 1;
monCommentaire.present_moinsture =80;
monCommentaire.node_requirement=30;

// On le sauvegarde dans MongoDB !
monCommentaire.save(function (err) {
    if (err) { throw err; }
    console.log('Commentaire ajouté avec succès !');
    // On se déconnecte de MongoDB maintenant
    //mongoose.connection.close();
});

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
            console.log('weather code: ' + comm.weather_code);
            console.log('------------------------------');
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(time);

            results = [comm._id, comm.node_id, comm.date, comm.node_requirement, comm.present_moinsture];
            console.log(results);
//Get marvel characters' name, picture and id.
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

            mongoose.connection.close();
           sleep(10000);
        });

}


const server_Port=5000;


//Listen to the defined port
app.listen(server_Port, () => console.log(`Server started on port ${server_Port}`));


