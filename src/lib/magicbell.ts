import * as core from '@actions/core';
import { Client } from 'magicbell';

import pkg from '../../package.json';

export const magicbell = new Client({
  apiKey: core.getInput('api-key', { required: true }),
  apiSecret: core.getInput('api-secret', { required: true }),
  appInfo: {
    name: pkg.name,
    version: pkg.version,
  },
});
