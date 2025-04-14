import { createCommand } from 'commander';
import { decryptFile, encryptFile, decryptDir, encryptDir } from './encrypt.utils';
import { generateMaterial } from './crypto-material.utils';
import passwordPropmt from '@inquirer/password';
import { basename, join } from 'path';
import { pathExists, remove } from 'fs-extra';
import { stat } from 'fs/promises';

const program = createCommand('encrypted-fs').version('1.0.0');

program
  .command('encrypt <from>')
  .action(async (from) => {
    if (! await pathExists(from)) {
      throw new Error(`Path do not exists: ${from}`);
    }
    const pathStat = await stat(from);
    const password = await passwordPropmt({ message: 'Your password: ' });
    if (!pathStat.isDirectory()) {
      await encryptFile(from, password);
      return;
    }
    const to = join(process.cwd(), `${basename(from)}.zip`);
    if (await pathExists(to)) {
      throw new Error(`File already exists: ${to}`);
    }
    await encryptDir(from, to, password);
  });

program
  .command('decrypt <from>')
  .action(async (from) => {
    const dataDir = join(process.cwd(), 'data');
    await remove(dataDir);
    const password = await passwordPropmt({ message: 'Your password: ' });
    if (from.endsWith('.zip')) {
      await decryptDir(from, dataDir, password);
    } else {
      await decryptFile(from, password);
    }
  });

program
  .command('generate')
  .description('Generate crypto material')
  .action(() => generateMaterial());

program.parseAsync(process.argv).catch((e) => console.error('Error during program execution', e));
