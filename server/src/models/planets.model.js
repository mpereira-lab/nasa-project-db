
const fs = require('fs');
const path = require('path')
const { parse } = require('csv-parse')

const planets = require('./planets.mongo')

function isHabitable(planet) {
    return planet.koi_disposition === 'CONFIRMED'
        && planet.koi_insol > 0.36 && planet.koi_insol < 1.11
        && planet.koi_prad < 1.6;
}

function loadPlanets() {

    return new Promise((resolve, reject)=>{
    const savePlanets = [];
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('error', (err) => reject(err))
        .on('data', async (data) => {
            if (isHabitable(data)){
                savePlanets.push(savePlanet(data));
            }
        })
        .on('end', async () => {
            console.log('Loading plantes...')
            await Promise.all(savePlanets);
            const countHabitables = (await getAllPalnets()).length;
            console.log(`habitables = ${countHabitables}`);
            resolve();
        })});
}

async function getAllPalnets() {
    const habitables = await  planets.find({}, '-__v -_id');
    // console.log("habitables");
    // console.log(habitables);
    return habitables;
}

async function savePlanet(data){
    try{
        await planets.updateOne({
                keplerName: data.kepler_name
            },
            {   
                keplerName: data.kepler_name,
            },
            {
                upsert: true
            }   );
    } catch (err) {
        console.error(`Could not save the planet ${err}`);
    }
}

module.exports = {
    getAllPalnets,
    loadPlanets
}
