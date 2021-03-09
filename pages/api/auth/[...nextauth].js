import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { connectToDB, verifyPassword } from '../../../lib/auth-util';

export default NextAuth({
  session: { jwt: true },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDB();
        const db = client.db();
        const userCollection = await db.collection('users');
        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('User not found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Invalid credentials!');
        }

        client.close();
        return { email: user.email };
      },
    }),
  ],
});
