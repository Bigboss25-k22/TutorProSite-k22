const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb+srv://22120216:1234567890@cluster0.a4c05.mongodb.net/tutorify?retryWrites=true&w=majority&appName=Cluster0'); 
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

module.exports = { connect };