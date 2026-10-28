'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { createStrictLimiter } = require('../security/rateLimiter');
const { buildReview } = require('../workflows/build-review');

router.use(requireAuth);
router.post('/build-review', createStrictLimiter(), async (req, res, next) => {
  try {
    return res.json(await buildReview(req.body || {}));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
