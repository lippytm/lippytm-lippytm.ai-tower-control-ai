'use strict';

const router = require('express').Router();
const authRoutes = require('./auth');
const connectorRoutes = require('./connectors');
const dataRoutes = require('./data');
const swarmRoutes = require('./swarm');
const aiWorkflowRoutes = require('./aiWorkflows');

router.use('/auth', authRoutes);
router.use('/connectors', connectorRoutes);
router.use('/data', dataRoutes);
router.use('/swarm', swarmRoutes);
router.use('/workflows', aiWorkflowRoutes);

module.exports = router;
