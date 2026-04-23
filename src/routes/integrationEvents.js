const express = require('express');
const { buildIntegrationEvent } = require('../fleet/integration_events');

const router = express.Router();

router.post('/integration-events', (req, res) => {
  const body = req.body || {};
  const event = buildIntegrationEvent({
    eventType: body.event_type || 'task.created',
    sourceRepo: body.source_repo || 'unknown/source',
    sourceComponent: body.source_component || 'unknown-component',
    targetRepo: body.target_repo || 'unknown/target',
    targetComponent: body.target_component || 'routing',
    lane: body.lane || 'product',
    payload: body.payload || {},
    status: body.status || 'queued'
  });

  res.status(202).json({
    status: 'accepted',
    normalized_event: event
  });
});

module.exports = router;
