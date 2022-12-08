import cp from 'child_process';
import path from 'path';
import process from 'process';

export function run(script: string, inputs: { [key: string]: string }) {
  const nodePath = process.execPath;
  const inputPath = path.join(__dirname, '..', '..', 'dist', `${script}.js`);

  const env = Object.keys(inputs).reduce(
    (acc, key) =>
      Object.assign(acc, {
        [`INPUT_${key.replace(/ /g, '_').toUpperCase()}`]: inputs[key],
      }),
    {},
  );

  const proc = cp.spawnSync(nodePath, [inputPath], { env });
  return { stdout: proc.stdout.toString(), stderr: proc.stderr.toString(), status: proc.status };
}
