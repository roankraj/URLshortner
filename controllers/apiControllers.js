import Model from '../models/Model.js';
import { nanoid } from 'nanoid';
import validator from 'validator';

export const getLink = async (req, res, next) => {
  const data = await Model.findOne({ short: req.params.link });

  if (!data) {
    const err = new Error('Short URL not found');
    err.status = 404;

    throw err;
  }
  res.redirect(data.link);
};

export const postLink = async (req, res, next) => {
  const url = req.query.url;

  if (
    typeof url !== 'string' ||
    url.length > 2048 ||
    !validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  ) {
    return res.status(400).json({ status: 'error', message: 'Invalid URL' });
  }

  const prev = await Model.findOne({ link: url });

  if (prev) {
    return res.status(201).json({
      status: 'success',
      data: prev,
    });
  }

  const id = nanoid(10);

  const newURL = await Model.create({
    link: url,
    short: id,
  });

  res.status(201).json({
    status: 'success',
    data: newURL,
  });
};
