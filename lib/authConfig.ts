import { sessions } from '../db/schema';
// auth config
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { accounts, users } from '@/db/schema';
import { LoginSchema } from '@/lib/loginschema';

export default {
  providers: [
    // Google({
    //   clientId: `${process.env.AUTH_GOOGLE_ID}`,
    //   clientSecret: `${process.env.AUTH_GOOGLE_SECRET}`,
    // }),

    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async credentials => {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, `${credentials.email}`))
          .limit(1)
          .then(res => res[0]);

        if (!user) return null;

        const check = await db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, user.id))
          .limit(1);

        const expDate = Date.now() + 9 * 60 * 60;

        if (check.length > 0) {
          // console.log("found something");
          await db
            .update(accounts)
            .set({
              session_state: 'updatedcredentials',
            })
            .where(eq(accounts.userId, user.id));

          // await db.update(sessions).set({
          //   sessionToken: "",
          //   userId: user.id,
          //   expires: new Date(expDate),
          // });
        } else {
          await db.insert(accounts).values({
            userId: user.id,
            type: `email`,
            provider: `credentials`,
            providerAccountId: user.id,
            session_state: 'newcredentials',
            // expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
          });

          // await db.insert(sessions).values({
          //   sessionToken: "",
          //   userId: user.id,
          //   expires: new Date(Date.now() + 30 * 24 * 60 * 60),
          // });
        }

        // console.log("iam loggin in");

        return {
          id: user.id,
          name: user.firstname,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
