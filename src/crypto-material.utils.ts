import { randomBytes } from 'crypto';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

const MATERIAL_PATH = './material.mcrt';
const SALT_SIZE = 32;
const IV_SIZE = 16;

export interface CryptoMaterial {
  iv: Buffer;
  salt: Buffer;
}

const genVersion = (): Buffer => {
  const buffer = Buffer.alloc(1);
  buffer.writeInt8(1);
  return buffer;
}

export async function generateMaterial(): Promise<void> {
  if (existsSync(MATERIAL_PATH)) {
    throw new Error('Material exists please recheck what is going on');
  }
  const iv = randomBytes(IV_SIZE);
  const salt = randomBytes(SALT_SIZE);
  const material = Buffer.concat([genVersion(), iv, salt]);
  await writeFile(MATERIAL_PATH, material);
}

export async function readMaterial(): Promise<CryptoMaterial> {
  if (!existsSync(MATERIAL_PATH)) {
    throw new Error('No crypto material found');
  }
  const data = await readFile(MATERIAL_PATH);
  const version = data.readInt8();
  if (version !== 1) {
    throw new Error('Wrong version of material');
  }
  const iv = Buffer.alloc(IV_SIZE);
  const salt = Buffer.alloc(SALT_SIZE);
  data.copy(iv, 0, 1, IV_SIZE + 1);
  data.copy(salt, 0, IV_SIZE + 1);
  return {
    iv,
    salt,
  };
}
