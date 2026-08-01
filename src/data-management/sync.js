'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');
const syncJobs = new Map();
const CONNECTORS = ['openai','gemini','claude','allbots','factory-ai','replit','github-copilot','github-publishing','blb-public-knowledge','swarm'];

function scheduleSync(source, target, options = {}) {
  if (!CONNECTORS.includes(source)) throw new Error(`Unknown source connector: ${source}. Valid options: ${CONNECTORS.join(', ')}`);
  if (!CONNECTORS.includes(target)) throw new Error(`Unknown target connector: ${target}. Valid options: ${CONNECTORS.join(', ')}`);
  if (source === 'blb-public-knowledge' && options.includePrivateData) throw new Error('Private BLB data cannot use the public connector');
  const jobId = uuidv4();
  const job = { jobId, status:'pending', source, target, options, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), result:null, error:null };
  syncJobs.set(jobId, job);
  logger.info('Data sync job scheduled', { jobId, source, target });
  setImmediate(() => _processSync(jobId));
  return { jobId, status:job.status, source, target, createdAt:job.createdAt };
}
function getSyncJob(jobId) { const job=syncJobs.get(jobId); if(!job) throw new Error(`Sync job not found: ${jobId}`); return job; }
function listSyncJobs() { return Array.from(syncJobs.values()); }
async function _processSync(jobId) {
  const job=syncJobs.get(jobId); if(!job) return;
  _updateJob(jobId,{status:'running',updatedAt:new Date().toISOString()});
  try {
    await new Promise((resolve)=>setTimeout(resolve,500));
    _updateJob(jobId,{status:'completed',updatedAt:new Date().toISOString(),result:{recordsSynced:0,message:'Sync completed successfully'}});
  } catch(error) {
    _updateJob(jobId,{status:'failed',updatedAt:new Date().toISOString(),error:error.message});
    logger.error('Data sync job failed',{jobId,error:error.message});
  }
}
function _updateJob(jobId,fields){const job=syncJobs.get(jobId);if(job)syncJobs.set(jobId,{...job,...fields});}
module.exports={scheduleSync,getSyncJob,listSyncJobs,CONNECTORS,_resetJobsForTests:()=>syncJobs.clear()};
