'use strict';

function invalid(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw invalid(`${name} must be an object`);
  }
}

function requireText(value, name) {
  if (typeof value !== 'string' || !value.trim()) {
    throw invalid(`${name} must be a non-empty string`);
  }
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw invalid('messages array is required');
  }
  for (const message of messages) {
    requireObject(message, 'message');
    if (!['system', 'user', 'assistant', 'developer'].includes(message.role)) {
      throw invalid('message role must be system, user, assistant, or developer');
    }
    requireText(message.content, 'message content');
  }
}

module.exports = { invalid, requireObject, requireText, validateMessages };
