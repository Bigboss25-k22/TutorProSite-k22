const mongoose = require('mongoose');
const Registration = require('../app/models/Registration');
const Tutor = require('../app/models/Tutor');
const Course = require('../app/models/Course');

mongoose.connect('mongodb+srv://22120216:1234567890@cluster0.a4c05.mongodb.net/tutorify?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    // Delete existing registrations
    await Registration.deleteMany({});
    
    // Fetch existing tutors and courses
    const tutors = await Tutor.find({});
    const courses = await Course.find({});
    
    // Select up to 10 random tutors
    const selectedTutors = tutors.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // Sample registrations
    const sampleRegistrations = selectedTutors.map(tutor => ({
        userId: tutor._id,
        courseId: courses[Math.floor(Math.random() * courses.length)]._id,
        status: 'Chờ thanh toán',
    }));
    
    // Insert sample registrations
    await Registration.insertMany(sampleRegistrations);
    
    console.log('Sample registrations added.');
    mongoose.connection.close();
})
.catch(err => {
    console.error(err);
});