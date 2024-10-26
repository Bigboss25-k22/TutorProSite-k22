const userRouter = require('./user');
const authRouter = require('./auth');

function route(app) {

    app.use('/users', userRouter);
    app.use('/', authRouter)
     
}

module.exports = route;