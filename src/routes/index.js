//const userRouter = require('./user');
const authRouter = require('./auth');
//const tutorRouter = require('./tutor');

function route(app) {

   //app.use('/users', userRouter);
   app.use('/', authRouter)
  // app.use('/tutors', tutorRouter)
     
}

module.exports = route;