'use strict';

const FREE_AI_TOOLS = Object.freeze([
  {
    id: 'journal-coach',
    name: 'Reflective Journal Coach',
    category: 'self-awareness',
    cost: 'free',
    value: 'Turns daily reflections into patterns, wins, and friction points.',
  },
  {
    id: 'habit-priority-map',
    name: 'Habit Priority Map',
    category: 'self-improvement',
    cost: 'free',
    value: 'Ranks habits by impact so users focus on the smallest high-leverage upgrades.',
  },
  {
    id: 'focus-sprint-planner',
    name: 'Focus Sprint Planner',
    category: 'productivity',
    cost: 'free',
    value: 'Builds realistic sprint blocks with breaks and recovery.',
  },
  {
    id: 'stress-reset-bot',
    name: 'Stress Reset Bot',
    category: 'self-healing',
    cost: 'free',
    value: 'Suggests breathing, grounding, and recovery actions when stress rises.',
  },
  {
    id: 'sleep-recovery-check',
    name: 'Sleep Recovery Check',
    category: 'self-healing',
    cost: 'free',
    value: 'Flags low-rest risk and proposes the next best recovery action.',
  },
  {
    id: 'swarm-health-sync',
    name: 'Swarm Health Sync',
    category: 'system self-healing',
    cost: 'free',
    value: 'Maps personal wellbeing signals to orchestration health-check cadence.',
  },
]);

const HEALING_CATEGORIES = new Set(['self-healing', 'system self-healing']);

function toSafeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function getStabilityBand({ mood, stress, energy, sleepHours }) {
  if (stress >= 8 || mood <= 3 || energy <= 3 || sleepHours < 4) return 'recover';
  if (stress >= 6 || mood <= 5 || energy <= 5 || sleepHours < 6) return 'watch';
  return 'stable';
}

function buildRecommendations(input) {
  const { mood, stress, energy, sleepHours, goals, blockers } = input;
  const recs = [];

  if (sleepHours < 6) recs.push('Prioritize sleep recovery tonight before adding more workload.');
  if (stress >= 7) recs.push('Run a 5-minute breathing reset before the next focus block.');
  if (energy <= 4) recs.push('Use one short deep-work sprint (25-40 min) with a mandatory recovery break.');
  if (mood <= 4) recs.push('Schedule one low-effort win in the next hour to rebuild momentum.');
  if (blockers.length > 0) recs.push('Convert blockers into explicit asks and delegate one item now.');

  if (goals.length > 0) {
    recs.push(`Anchor the day around this priority: ${goals[0]}.`);
  } else {
    recs.push('Define one clear daily outcome to avoid context switching.');
  }

  return recs;
}

function buildSelfHealProtocol(input) {
  const { stress, energy, sleepHours, symptoms } = input;

  const immediate = [
    'Pause new commitments for the next 30 minutes.',
    'Hydrate and do a short mobility reset.',
    'Capture all open loops into a single checklist.',
  ];

  if (stress >= 7) immediate.push('Run box breathing for 4 rounds (4-4-4-4).');
  if (energy <= 4) immediate.push('Move one non-urgent task to tomorrow.');
  if (sleepHours < 6) immediate.push('Set a sleep-protection cutoff time for tonight.');

  const next24Hours = [
    'Timebox no more than 3 critical tasks.',
    'Protect at least two recovery breaks.',
    'Avoid reactive multitasking windows where possible.',
  ];

  const next7Days = [
    'Review recurring stress triggers and remove one systemic source.',
    'Track sleep/energy/mood trend once daily.',
    'Increase delegation or automation for low-value repeated tasks.',
  ];

  const escalation = [
    'If stress remains very high for multiple check-ins, reduce scope and request support.',
    'If sleep debt persists for 3+ nights, prioritize recovery before optimization work.',
  ];

  if (symptoms.includes('panic') || symptoms.includes('hopelessness')) {
    escalation.push('If emotional distress feels unsafe, contact local emergency or professional support immediately.');
  }

  return { immediate, next24Hours, next7Days, escalation };
}

function runJarvisCheckIn(payload = {}) {
  const checkIn = payload.checkIn || {};
  const goals = normalizeList(payload.goals);
  const blockers = normalizeList(checkIn.blockers);
  const symptoms = normalizeList(checkIn.symptoms).map((item) => item.toLowerCase());

  const normalized = {
    mood: toSafeNumber(checkIn.mood, 5),
    stress: toSafeNumber(checkIn.stress, 5),
    energy: toSafeNumber(checkIn.energy, 5),
    sleepHours: toSafeNumber(checkIn.sleepHours, 7),
    goals,
    blockers,
    symptoms,
  };

  const stabilityBand = getStabilityBand(normalized);
  const recommendations = buildRecommendations(normalized);
  const protocol = buildSelfHealProtocol(normalized);

  return {
    assistant: 'Jarvis',
    version: 'free-enhanced-v1',
    stabilityBand,
    signals: {
      mood: normalized.mood,
      stress: normalized.stress,
      energy: normalized.energy,
      sleepHours: normalized.sleepHours,
      blockers,
      symptoms,
    },
    recommendations,
    selfHealingProtocol: protocol,
    freeTools: getFreeToolsCatalog(),
  };
}

function getFreeToolsCatalog() {
  return FREE_AI_TOOLS.map((tool) => ({ ...tool }));
}

function isHealingTool(tool = {}) {
  return HEALING_CATEGORIES.has(tool.category);
}

module.exports = {
  runJarvisCheckIn,
  getFreeToolsCatalog,
  isHealingTool,
};
