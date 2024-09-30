import { createCommand } from 'commander';
import { decryptFile, encryptFile } from './encrypt.utils';
import { generateMaterial } from './crypto-material.utils';
import passwordPropmt from '@inquirer/password';

const program = createCommand('encrypted-fs').version('1.0.0');

program
  .command('encrypt <from>')
  .action(async (from) => {
    const password = await passwordPropmt({ message: 'Your password: ' });
    await encryptFile(from, password);
  });

program
  .command('decrypt <from>')
  .action(async (from) => {
    const password = await passwordPropmt({ message: 'Your password: ' });
    await decryptFile(from, password);
  });

program
  .command('generate')
  .description('Generate crypto material')
  .action(() => generateMaterial());

program.parseAsync(process.argv).catch((e) => console.error('Error during program execution', e));
