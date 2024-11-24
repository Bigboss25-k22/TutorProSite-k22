const userRouter = require('./user');
const authRouter = require('./auth');
const tutorRouter = require('./tutor');
const courseRouter = require('./course');


function route(app) {
  app.use('/', authRouter);  
  app.use('/users', userRouter);
  app.use('/tutors', tutorRouter);
  app.use('/courses', courseRouter);
}

module.exports = route;