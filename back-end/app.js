const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const studentRouter = require('./routes/studentRouter');
const adminRouter = require('./routes/adminRouter');
const collegeRouter = require('./routes/collegeRouter');
const searchRouter = require('./routes/searchRouter');
const highSchoolRouter = require('./routes/highSchoolRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/students', studentRouter);
app.use('/admin', adminRouter);
app.use('/colleges', collegeRouter);
app.use('/search', searchRouter);
app.use('/highSchools', highSchoolRouter);

// catch 404 a
app.use((req, res) => {
    res.status(404);
    res.send({ error: '404 not found' });
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
