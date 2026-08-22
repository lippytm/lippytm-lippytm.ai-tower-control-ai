'use strict';

const router = require('express').Router();
const authRoutes = require('./auth');
const connectorRoutes = require('./connectors');
const dataRoutes = require('./data');
const swarmRoutes = require('./swarm');
const multiaiRoutes = require('./multiai');

router.use('/auth', authRoutes);
router.use('/connectors', connectorRoutes);
router.use('/data', dataRoutes);
router.use('/swarm', swarmRoutes);
router.use('/multiai', multiaiRoutes);

module.exports = router;
