import { MongoClient } from 'mongodb';
import { hash, compare } from 'bcryptjs';

export async function connectToDB() {
  const client = await MongoClient.connect(
    `mongodb+srv://test1234:test1234@cluster0.gvoli.mongodb.net/auth-demo?retryWrites=true&w=majority`
  );
  return client;
}

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
