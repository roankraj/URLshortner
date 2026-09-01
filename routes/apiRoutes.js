import express from 'express';
import { getLink, postLink } from '../controllers/apiControllers.js';

const router = express.Router();

router.route('/').post(postLink);
router.route('/:link').get(getLink);

export default router;
