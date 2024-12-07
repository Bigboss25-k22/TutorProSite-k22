const userRouter = require('./user');
const authRouter = require('./auth');
const tutorRouter = require('./tutor');
const courseRouter = require('./course');
const adminRouter = require('./admin');
const parnetRouter = require('./parent');



function route(app) {
  app.use('/', authRouter);  
  app.use('/admin', adminRouter);
  app.use('/users', userRouter);
  app.use('/tutors', tutorRouter);
  app.use('/courses', courseRouter);
  app.use('/parents', parnetRouter);
}

module.exports = route;