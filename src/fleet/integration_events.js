function buildIntegrationEvent({
  eventType,
  sourceRepo,
  sourceComponent,
  targetRepo,
  targetComponent,
  lane,
  payload,
  status = 'queued'
}) {
  return {
    event_id: `evt_${Date.now()}`,
    event_type: eventType,
    event_version: '1.0.0',
    timestamp: new Date().toISOString(),
    source: {
      repo: sourceRepo,
      component: sourceComponent,
      lane,
      environment: 'dev'
    },
    target: {
      repo: targetRepo,
      component: targetComponent
    },
    payload: payload || {},
    status
  };
}

function buildCheckoutCompletedEvent({ customerReference, productCode, amountUsd }) {
  return buildIntegrationEvent({
    eventType: 'billing.event',
    sourceRepo: 'lippytm/Web3AI',
    sourceComponent: 'payments',
    targetRepo: 'lippytm/lippytm-lippytm.ai-tower-control-ai',
    targetComponent: 'fleet',
    lane: 'commerce',
    payload: {
      customerReference,
      productCode,
      amountUsd,
      billingState: 'completed'
    },
    status: 'completed'
  });
}

function buildAssistantTaskEvent({ taskId, objective, targetRepo }) {
  return buildIntegrationEvent({
    eventType: 'task.created',
    sourceRepo: 'lippytm/OpenClaw-lippytm.AI-',
    sourceComponent: 'assistant',
    targetRepo,
    targetComponent: 'routing',
    lane: 'product',
    payload: {
      taskId,
      objective
    },
    status: 'queued'
  });
}

module.exports = {
  buildIntegrationEvent,
  buildCheckoutCompletedEvent,
  buildAssistantTaskEvent
};
