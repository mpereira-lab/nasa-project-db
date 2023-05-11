const mongoose = require('mongoose')

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.on('open', ()=> {
    console.log('mongodb connection ready...')
})

mongoose.connection.on('error', (err)=> {
    console.error(err)
})


async function mongoConnect(){
    await mongoose.connect(MONGO_URL,
        {
        });
}

async function mongoDisconnect(){
    await mongoose.disconnect();
    // await mongoose.connection.close();    
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}