

var etat="OFF";

async function decision(seuil,moinsture,weatherState) {
    var weather=1;
    if (weatherState=="rainy") weather=2.25;
    if (weatherState=="shower rain") weather=2;
    if (weatherState=="thunderstorm") weather=2.5;
    if (seuil-moinsture>0)
    {
             if (moinsture*weather<seuil)
             {
                 etat="ON";}
             else etat="OFF"
    }

    else {
        etat="OFF"
    }
return etat;

}
module.exports= {
    getDecision: decision
}