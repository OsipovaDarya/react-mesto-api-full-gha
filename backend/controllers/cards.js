const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const CastError = require('../errors/CastError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCards = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new Forbidden('Доступ к странице запрещен');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};

module.exports.putLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['likes', 'owner'])
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new CastError('Ошибка проверки данных'));
      } else {
        next(error);
      }
    });
};
