const http = require('http');

require('dotenv').config();

const { loadPlanets } = require('./models/planets.model');
const { loadLaunches } = require('./models/launches.model');



const app = require('./app');

const { mongoConnect } = require('./services/mongo')

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function start() {
    await mongoConnect();
    await loadPlanets();
    await loadLaunches();
    server.listen(PORT, () => { console.log(`Listening port ${PORT}`) });
}

start();
