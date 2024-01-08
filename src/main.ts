import { createCommand } from 'commander';
import { decryptFile, encryptFile } from './encrypt.utils';
import { generateMaterial } from './crypto-material.utils';

const program = createCommand('encrypted-fs').version('1.0.0');

program
  .command('encrypt <from>')
  .action((from) => encryptFile(from, 'test'));

program
  .command('decrypt <from>')
  .action((from) => decryptFile(from, 'test'));

program
  .command('generate')
  .description('Generate crypto material')
  .action(() => generateMaterial());

program.parseAsync(process.argv).catch((e) => console.error('Error during program execution', e));
