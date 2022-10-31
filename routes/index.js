const indexRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./Users');
const movieRouter = require('./movies');
const { signUp, signIn, signOut } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const NotFound = require('../errors/NotFoundError');

indexRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signUp);

indexRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signIn);

indexRouter.use(auth);

indexRouter.post('/signout', signOut);
indexRouter.use('/', userRouter);
indexRouter.use('/', movieRouter);

indexRouter.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = indexRouter;
