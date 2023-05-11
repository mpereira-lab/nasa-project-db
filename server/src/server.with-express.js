const express = require('express');

const PORT = process.env.PORT || 8000;

const app = express();
app.listen(PORT, ()=>{console.log(`Listening port ${PORT}`)})

console.log(PORT);
console.log("HELLO");
