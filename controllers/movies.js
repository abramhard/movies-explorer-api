const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};
const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFound('Фильм с указанным id не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw next(new ForbiddenError('Вы не можете удалить этот фильм'));
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequest('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
