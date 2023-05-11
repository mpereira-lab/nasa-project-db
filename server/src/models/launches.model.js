const axios = require('axios');
const launchesDb = require('./launches.mongo');
const planetsDb = require('./planets.mongo');

const INITIAL_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

// const launch = {
//     flightNumber: 100, //flight_number
//     mission: 'Kepler Exploration X', //name
//     rocket: 'IS1', //rocket.name
//     launchDate: new Date('September 27, 2030'), //date_local
//     target: 'Kepler-442 b', //not aplicable
//     customers: ['ZTM', 'NASA'], //payloads.customers
//     upcoming: true, //upcoming
//     success: false //success
// }

// saveLaunches(launch)

async function getLastFlightNumber(){
    const lastLaunch = await launchesDb.findOne()
        .sort('-flightNumber')
    if (!lastLaunch){
        return INITIAL_FLIGHT_NUMBER;
    }
    return lastLaunch.flightNumber;
}


async function existLaunchWithId(id){
    return await findLaunch({flightNumber: id});
}

async function getAllLaunches(limit, skip) {
   return await launchesDb.find({}, 
        {'_id': 0, '__v': 0})
    .sort({ flightNumber: 1}) //-1 para descendente 
    .limit(limit)
    .skip(skip);
}

async function addDbLaunch(launch){

    const planet = await planetsDb.findOne({
        keplerName: launch.target
    })

    if (!planet){
        throw new Error('No matching planet found');
    }

    const latestFlightNumber = await getLastFlightNumber()+1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['ZTM', 'NASA'],
        success: true,
        upcoming: true
    })
    await saveLaunches(newLaunch)
}

async function abortLaunch(id){
    const aborted = await launchesDb.updateOne({
        flightNumber: id
    },
    {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount==1

}

async function saveLaunches(launch){

    await launchesDb.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
    
}

async function findLaunch(filter){
    return await launchesDb.findOne(filter);
}

async function populrateLaunches(){
    console.log('Loading launches...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select : {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select : {
                        'customers': 1
                    }
                }
                ] 
        }
    })


    if (response.status!==200){
        console.log('Problem during download launches');
        throw new Error('Launch data download failed');
        
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload)=>{
            return payload.customers;
        })
        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunches(launch);
    }

}

async function loadLaunches(){

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch){
        console.log('Launch data already lodaded');    
    } else {
        populrateLaunches();
    }

}

module.exports = {
    existLaunchWithId,
    getAllLaunches,
    addDbLaunch, 
    abortLaunch,
    loadLaunches
}

