import { email, z } from 'zod';

import { db } from '@/db';

import { accounts, users } from '@/db/schema';
import type { IncomingHttpHeaders } from 'node:http';
import { os } from '@orpc/server';

// import { systems_requests, reach_request } from "@/db/schema";

import { eq, or, and, desc, ne, sql } from 'drizzle-orm';
// import { signIn, signOut } from '@/auth';

import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import { signIn, signOut } from '@/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// const driverRegisterSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   identification: z.string().min(13),
//   driversLicense: z.string().min(6),
//   passwordConfirmation: z.string().min(6),
// });

export const authCheckemail = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(z.object({ emailAddress: z.string() }))
  .handler(async ({ input, context }) => {
    // Perform delete
    const getdata = await db
      .select()
      .from(users)
      .where(eq(users.email, input.emailAddress));

    return getdata;
  });

export const loginOutput = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input; // destructering

    // 1. Validate user
    // checking to see if the user is there
    // email: callmekaywork@gmail.com
    // password: ilovebasketball
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then(res => res[0]);

    if (!user) {
      console.log('user was invalid');
      throw new Error('Invalid credentials');
    }

    // 2. Check accounts
    const check = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id))
      .limit(1);

    if (check.length > 0) {
      await db
        .update(accounts)
        .set({ session_state: 'updatedcredentials' })
        .where(eq(accounts.userId, user.id));
    } else {
      await db.insert(accounts).values({
        userId: user.id,
        type: 'email',
        provider: 'credentials',
        providerAccountId: user.id,
        session_state: 'newcredentials',
      });
    }

    // sign us in
    const checkSignIn = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (checkSignIn)
      // this worked

      // 3. Return user object
      return {
        id: user.id,
        name: user.firstname,
        email: user.email,
        role: user.role, // if role == admin show this part of the code
      };
    else {
      return { error: 'something went wrong!' };
    }
  });

export const router = {
  admin: {
    auth: loginOutput,
    // create: createNewPost,
    // delete: deletePost,
    signout: os
      .input(z.object({ id: z.string() }))
      .handler(async ({ input }) => {
        signOut();
        // redirect('/');
      }),
  },
};
function getServerSession(authOptions: any) {
  throw new Error('Function not implemented.');
}
