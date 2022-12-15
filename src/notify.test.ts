import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';

import { run } from './__tests__/run';
import { withInputs } from './__tests__/with-inputs';

const magicbell = {
  notifications: {
    create: jest.fn(),
  },
};

const write = process.stdout.write.bind(process.stdout);

beforeEach(() => {
  // @ts-ignore - stub out write, as @actions/core will pollute console output
  process.stdout.write = jest.fn();
});
afterEach(() => {
  process.stdout.write = write;
});

jest.mock('magicbell', () => ({
  Client: function () {
    return magicbell;
  },
}));

test('throws error when api key is missing', () => {
  const { stderr, status } = run('notify', {
    title: 'hello from the action',
    'api-secret': 'secret key',
  });

  expect(status).toEqual(1);
  expect(stderr).toContain('Input required and not supplied: api-key');
});

test('throws error when api secret is missing', () => {
  const { stderr, status } = run('notify', {
    title: 'hello from the action',
    'api-key': 'api key',
  });

  expect(status).toEqual(1);
  expect(stderr).toContain('Input required and not supplied: api-secret');
});

test('can create notification', async () => {
  withInputs({
    'api-key': 'api key',
    'api-secret': 'api secret',
    title: 'hello from the action',
    recipients: 'person@example.com',
  });

  await import('./notify').then((x) => x.run());

  expect(magicbell.notifications.create).toHaveBeenCalledWith({
    title: 'hello from the action',
    recipients: [{ email: 'person@example.com' }],
  });
});

test('can send notification to multiple recipients', async () => {
  withInputs({
    'api-key': 'api key',
    'api-secret': 'api secret',
    title: 'hello from the action',
    recipients: 'person@example.com, bot@example.com',
  });

  await import('./notify').then((x) => x.run());

  expect(magicbell.notifications.create).toHaveBeenCalledWith({
    title: 'hello from the action',
    recipients: [{ email: 'person@example.com' }, { email: 'bot@example.com' }],
  });
});

test('can provide json to recipients', async () => {
  withInputs({
    'api-key': 'api key',
    'api-secret': 'api secret',
    title: 'hello from the action',
    recipients: '[{ "email": "person@example.com" }, { "external_id": "abc" }]',
  });

  await import('./notify').then((x) => x.run());

  expect(magicbell.notifications.create).toHaveBeenCalledWith({
    title: 'hello from the action',
    recipients: [{ email: 'person@example.com' }, { external_id: 'abc' }],
  });
});

test('does basic pattern matching on string based recipients', async () => {
  withInputs({
    'api-key': 'api key',
    'api-secret': 'api secret',
    title: 'hello from the action',
    recipients: 'email::person@example.com, external_id::abc, magicbell::subscribers',
  });

  await import('./notify').then((x) => x.run());

  expect(magicbell.notifications.create).toHaveBeenCalledWith({
    title: 'hello from the action',
    recipients: [{ email: 'person@example.com' }, { external_id: 'abc' }, { topic: { subscribers: true } }],
  });
});
