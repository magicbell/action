import cp from 'child_process';
import path from 'path';
import process from 'process';

import { withInputs } from './with-inputs';

export function run(script: string, inputs: { [key: string]: string }) {
  const nodePath = process.execPath;
  const inputPath = path.join(__dirname, '..', '..', 'dist', `${script}.js`);
  const env = withInputs(inputs);

  try {
    const stdout = cp.execSync(`${nodePath} ${inputPath}`, { env, stdio: 'pipe' }).toString();
    return { status: 0, stderr: '', stdout };
  } catch (error: any) {
    return { status: error.status, stderr: error.stderr.toString(), stdout: error.stdout.toString() };
  }
}
