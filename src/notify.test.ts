import { expect, test } from '@jest/globals';

import { run } from './__tests__/run';

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
