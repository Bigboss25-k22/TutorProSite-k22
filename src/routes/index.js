const userRouter = require('./user');
const authRouter = require('./auth');
const tutorRouter = require('./tutor');
const courseRouter = require('./course');
const adminRouter = require('./admin');
const parentRouter = require('./parent');
const transactionRouter = require('./transaction');
const reviewRouter = require('./review');
const messageRouter = require('./message');



function route(app) {
  app.use('/', authRouter);  
  app.use('/admin', adminRouter);
  app.use('/users', userRouter);
  app.use('/tutors', tutorRouter);
  app.use('/courses', courseRouter);
  app.use('/parents', parentRouter);
  app.use('/transactions', transactionRouter);
  app.use('/reviews', reviewRouter);
  app.use('/messages', messageRouter);

}

module.exports = route;