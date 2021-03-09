import { getSession } from 'next-auth/client';
import {
  connectToDB,
  verifyPassword,
  hashPassword,
} from '../../../lib/auth-util';

async function handler(req, res) {
  if (req.method !== 'PATCH') return;

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authorized!' });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  if (
    !oldPassword ||
    !newPassword ||
    newPassword.trim() === '' ||
    newPassword.trim().length < 7
  ) {
    res.status(403).json({ message: 'Please check the passwords' });
    return;
  }

  const client = await connectToDB();
  const db = client.db();
  const userCollection = db.collection('users');

  const userEmail = session.user.email;
  const user = await userCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not found!' });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Password is incorrect!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await userCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  console.log(result);
  client.close();
  res.status(200).json({ message: 'Password updated!' });
}

export default handler;
