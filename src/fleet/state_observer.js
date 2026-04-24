function observeRepoState({ repo, lane, promotionStage = 0, riskLevel = 'low', writeMode = 'proposal_only', confidence = 0.75, currentMissionId = null }) {
  return {
    system_id: repo,
    lane,
    state: currentMissionId ? 'planning' : 'idle',
    promotion_stage: promotionStage,
    risk_level: riskLevel,
    write_mode: writeMode,
    confidence,
    current_mission_id: currentMissionId,
    last_loop_summary: null,
    updated_at: new Date().toISOString(),
  };
}

function summarizeRepoStates(states = []) {
  return {
    total: states.length,
    byLane: states.reduce((acc, state) => {
      acc[state.lane] = (acc[state.lane] || 0) + 1;
      return acc;
    }, {}),
    activeMissions: states.filter((state) => state.current_mission_id).length,
    critical: states.filter((state) => state.risk_level === 'critical').length,
  };
}

module.exports = {
  observeRepoState,
  summarizeRepoStates,
};
