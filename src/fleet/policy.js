const SENSITIVITY_TO_DECISION = {
  S0: 'allow',
  S1: 'review',
  S2: 'review',
  S3: 'approve',
  S4: 'block'
};

const PROTECTED_PATH_PATTERNS = [
  '.github/workflows/',
  'src/security/',
  'src/fleet/',
  'brainkit/policies/',
  'backend/app/routes/payments',
  'contracts/'
];

function detectSensitivity(context) {
  const lane = context.lane || 'lab';
  const path = context.path || '';

  if (lane === 'commerce' || lane === 'hub') {
    return 'S4';
  }

  if (lane === 'control') {
    return 'S3';
  }

  if (lane === 'swarm' || lane === 'revenue') {
    return 'S2';
  }

  if (PROTECTED_PATH_PATTERNS.some((pattern) => path.startsWith(pattern))) {
    return 'S3';
  }

  if ((context.changeType || '') === 'create-doc') {
    return 'S0';
  }

  return 'S1';
}

function evaluatePolicy(context) {
  const input = context || {};
  const sensitivity = input.sensitivityClass || detectSensitivity(input);
  let decision = SENSITIVITY_TO_DECISION[sensitivity] || 'review';
  const reasons = [];

  if (input.path && PROTECTED_PATH_PATTERNS.some((pattern) => input.path.startsWith(pattern))) {
    reasons.push('protected path');
    if (decision === 'allow') {
      decision = 'review';
    }
  }

  if (input.securityImpact === 'high' || input.paymentImpact === 'high') {
    reasons.push('high security or payment impact');
    decision = 'approve';
  }

  if (input.destructive === true) {
    reasons.push('destructive action');
    decision = 'approve';
  }

  if (input.disableSecurity === true || input.exposesSecrets === true) {
    reasons.push('security boundary violation');
    decision = 'block';
  }

  if (input.multiRepo === true && decision === 'allow') {
    reasons.push('multi-repo change requires review');
    decision = 'review';
  }

  if (input.explicitApproval === true && decision !== 'block') {
    reasons.push('explicit approval provided');
    decision = 'approve';
  }

  return {
    decision,
    sensitivity,
    reasons,
    requiresHumanReview: decision === 'review' || decision === 'approve',
    blocked: decision === 'block'
  };
}

module.exports = {
  PROTECTED_PATH_PATTERNS,
  detectSensitivity,
  evaluatePolicy
};
