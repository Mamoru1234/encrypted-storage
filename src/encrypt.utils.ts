import { scrypt, createCipheriv, Cipher, Decipher, createDecipheriv, randomBytes } from 'crypto';
import { pipeline } from 'stream/promises';
import { Readable, Transform } from 'stream';
import { basename, dirname, join } from 'path';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { readMaterial } from './crypto-material.utils';
import { copyFile } from 'fs/promises';

const ALGORITHM = 'AES-256-CBC';
const KEY_SIZE = 32;
const EXT = '.encrd';

function scryptAsync(password: string | Buffer, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((res, rej) => {
    scrypt(password, salt, keyLength, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
}

export async function createCipher(password: string): Promise<Transform> {
  const { salt, iv } = await readMaterial();
  const key = await scryptAsync(password, salt, KEY_SIZE);
  return createCipheriv(ALGORITHM, key, iv);
}

async function backupOutput(outputPath: string): Promise<void> {
  if (!existsSync(outputPath)) {
    return;
  }
  copyFile(outputPath, `${outputPath}.bup`);
}

export async function createDecipher(password: string): Promise<Decipher> {
  const { salt, iv } = await readMaterial();
  const key = await scryptAsync(password, salt, KEY_SIZE);
  return createDecipheriv(ALGORITHM, key, iv);
}

export async function encryptFile(inputPath: string, password: string): Promise<void> {
  const cipher = await createCipher(password);
  const fileName = basename(inputPath);
  const baseDir = dirname(inputPath);
  const outputPath = join(baseDir, `${fileName}${EXT}`);
  await backupOutput(outputPath);
  await pipeline(createReadStream(inputPath), cipher, createWriteStream(outputPath));
}

export async function decryptFile(inputPath: string, password: string): Promise<void> {
  const decipher = await createDecipher(password);
  const fileName = basename(inputPath);
  const baseDir = dirname(inputPath);
  if (!fileName.endsWith(EXT)) {
    throw new Error('wrong file');
  }
  const outputName = fileName.slice(0, EXT.length * -1);
  const outputPath = join(baseDir, outputName);
  await backupOutput(outputPath);
  await pipeline(createReadStream(inputPath), decipher, createWriteStream(outputPath));
}
