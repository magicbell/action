import * as core from '@actions/core';

import { compact } from './lib/compact';
import { magicbell } from './lib/magicbell';

const tryParse = <T>(value: string, fallback: T | null = null): T | any => {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return fallback;
  }
};

const parseRecipients = (
  input: string,
): ({ email: string } | { external_id: string } | { topic: { subscribers: true } })[] => {
  const parsed = tryParse(
    input,
    input.split(',').map((x) => x.trim()),
  );

  const array = Array.isArray(parsed) ? parsed : [parsed];

  return array.map((x) => {
    if (typeof x === 'string') {
      const [type, value] = x.split('::');
      if (type === 'email') return { email: value };
      if (type === 'external_id') return { external_id: value };
      if (type === 'magicbell' && value === 'subscribers') return { topic: { subscribers: true } };
      return { email: x };
    }

    return x;
  });
};

export async function run(): Promise<void> {
  try {
    const recipients = parseRecipients(core.getInput('recipients', { required: true }));

    core.debug(`Send notification...`);

    const notification = await magicbell.notifications.create(
      compact({
        title: core.getInput('title', { required: true }),
        content: core.getInput('content'),
        recipients: recipients,
        category: core.getInput('category'),
        topic: core.getInput('topic'),
        action_url: core.getInput('action-url'),
        custom_attributes: tryParse(core.getInput('custom-attributes')),
        overrides: tryParse(core.getInput('overrides')),
      }),
    );

    core.setOutput('notification', notification);
    core.info(JSON.stringify(notification, null, 2));
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

if (process.env.NODE_ENV !== 'test') {
  run();
}
