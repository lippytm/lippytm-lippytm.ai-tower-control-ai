'use strict';

const router = require('express').Router();
const authRoutes = require('./auth');
const connectorRoutes = require('./connectors');
const dataRoutes = require('./data');
const swarmRoutes = require('./swarm');
const jarvisRoutes = require('./jarvis');

router.use('/auth', authRoutes);
router.use('/connectors', connectorRoutes);
router.use('/data', dataRoutes);
router.use('/swarm', swarmRoutes);
router.use('/jarvis', jarvisRoutes);

module.exports = router;
