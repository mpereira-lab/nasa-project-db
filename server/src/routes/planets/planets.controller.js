const { getAllPalnets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, resp){
    return resp.status(200).json(await getAllPalnets());
}

module.exports = {
    httpGetAllPlanets
}