const Api_Key="bfeedc276ce6a019613f89454d5263d1";
const url=`http://api.openweathermap.org/data/2.5/forecast?q=London,us,&APPID=${Api_Key}`;
const request = require("request-promise");

async function getWeather(){
    try {
        //Get all characters' data
        let api_call = await request({
            method: "GET",
            url: url,
            json: true,

        });
        console.log(api_call )
        return api_call ;

    } catch (error) {
        return error;
    }
}
/*
module.exports = {
    GetData: GetCharacters
}
async function getWeather(e) {
    e.preventDefault();
    const api_call = await fetch(
        url
    );

// Convert all the data to json file
    const response = await api_call.json();
    console.log(response);
    return response;
}

 */
module.exports={
    weatherData: getWeather
}