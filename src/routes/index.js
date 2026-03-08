'use strict';

const router = require('express').Router();
const authRoutes = require('./auth');
const connectorRoutes = require('./connectors');
const dataRoutes = require('./data');
const swarmRoutes = require('./swarm');
const { router: webhookRouter } = require('./webhook');
const logsRoutes = require('./logs');

router.use('/auth', authRoutes);
router.use('/connectors', connectorRoutes);
router.use('/data', dataRoutes);
router.use('/swarm', swarmRoutes);
router.use('/webhooks', webhookRouter);
router.use('/logs', logsRoutes);

module.exports = router;
