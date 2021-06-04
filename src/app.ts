import createError,{HttpError} from 'http-errors';
import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    message: { [key: string]: any };
  }
}

import indexRouter from './routes/index';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/stylesheets', express.static(path.resolve(__dirname, '../public/stylesheets')))
app.use('/fonts', express.static(path.resolve(__dirname, '../public/fonts')))
app.use('/images', express.static(path.resolve(__dirname, '../public/images')))
app.use('/javascripts', express.static(path.resolve(__dirname, '../public/javascripts')))

app.use('/assets', express.static(path.resolve(__dirname, '../public/assets')))
app.use('/admin-assets', express.static(path.resolve(__dirname, '../public/admin-assets')))

app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

//flash message middleware
app.use(function(req:Request, res:Response, next:NextFunction) {
  res.locals.message = req.session.message
  delete req.session.message
  next()
});


app.use('/', indexRouter);

app.use('/students/index',indexRouter)

//catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:HttpError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

export default app;
