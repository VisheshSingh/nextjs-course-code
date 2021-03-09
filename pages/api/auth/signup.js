import { connectToDB, hashPassword } from '../../../lib/auth-util';

async function handler(req, res) {
  if (req.method !== 'POST') return;

  const { email, password } = req.body;
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim() === '' ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: 'Invalid credentails or password must be at least 7 chars!',
    });
    return;
  }

  const client = await connectToDB();
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    res.status(409).json({ message: 'User already exists!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);
  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  });
  console.log(result);
  res.status(201).json({ message: 'User created!!!' });
  client.close();
}

export default handler;
