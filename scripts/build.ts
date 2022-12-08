import ncc from '@vercel/ncc';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

async function main() {
  const base = path.resolve(__dirname, '..');
  const files = readdirSync(path.join(base, 'src'))
    .filter((file) => /^[a-z-]*\.ts$/.test(file))
    .filter((file) => existsSync(path.join(base, file.replace(/\.ts$/, ''), 'action.yml')));

  await rm(path.join(base, 'dist'), { recursive: true });
  mkdirSync(path.join(base, 'dist'), { recursive: true });

  for (const file of files) {
    const source = path.join(base, 'src', file);
    const target = path.join(base, 'dist', file.replace(/\.ts$/, '.js'));

    const { code } = await ncc(source, {
      sourceMap: false,
      minify: true,
    });

    writeFileSync(target, code, { encoding: 'utf-8' });
    console.log(`built: ${file}`);
  }
}

main();
