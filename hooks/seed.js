// hooks/seed.js

import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Function to create the private ID
export function createPrivateID(publicID) {
  const privateSeed = process.env.PRIVATE_SEED;
  if (!privateSeed) {
    console.error('PRIVATE_SEED not set in environment variables');
    return null;
  }
  const hash = crypto.createHash('sha256');
  hash.update(publicID + privateSeed);
  const hashHex = hash.digest('hex');
  return `${publicID}:${hashHex}`;
}

// Function to retrieve and verify the public ID from the private ID
export function getPublicID(privateID) {
  const [publicID, hashHex] = privateID.split(':');
  
  const privateSeed = process.env.PRIVATE_SEED;
  if (!privateSeed) {
    console.error('PRIVATE_SEED not set in environment variables');
    return null;
  }

  // Recreate the hash to verify
  const hash = crypto.createHash('sha256');
  hash.update(publicID + privateSeed);
  const verificationHashHex = hash.digest('hex');

  // Check if the hashes match
  if (hashHex !== verificationHashHex) {
    console.error('Invalid private ID or tampered data');
    return null;
  }

  return publicID;
}

// Function to generate a secret seed
export function generateSecretSeed() {
  return crypto.randomBytes(32).toString('hex');
}
