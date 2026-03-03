'use strict';

const router = require('express').Router();
const authRoutes = require('./auth');
const connectorRoutes = require('./connectors');
const dataRoutes = require('./data');

router.use('/auth', authRoutes);
router.use('/connectors', connectorRoutes);
router.use('/data', dataRoutes);

module.exports = router;
