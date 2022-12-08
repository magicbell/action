import * as core from '@actions/core';

import { magicbell } from './lib/magicbell';

async function run(): Promise<void> {
  try {
    const customAttributes = core.getInput('custom-attributes');
    const overrides = core.getInput('overrides');

    core.debug(`Send notification...`);

    const res = await magicbell.notifications.create({
      title: core.getInput('title', { required: true }),
      content: core.getInput('content'),
      recipients: core
        .getInput('recipients', { required: true })
        .split(',')
        .map((x) => ({ email: x.trim() })),
      category: core.getInput('category'),
      topic: core.getInput('topic'),
      action_url: core.getInput('action-url'),
      custom_attributes: customAttributes ? JSON.parse(customAttributes) : undefined,
      overrides: overrides ? JSON.parse(overrides) : undefined,
    });

    core.setOutput('notification sent', res);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
