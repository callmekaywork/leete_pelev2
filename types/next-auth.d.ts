// import { email } from './../node_modules/zod/src/v4/core/regexes';

import NextAuth, { DefaultSession } from 'next-auth';

type UserRole = 'admin' | 'staff';

type UserData = {
  id: string;
  email: string;
  role?: string;
  firstname?: string | null;
  lastname?: string | null;
  image?: string | null;
};

declare module '@auth/core/types' {
  interface AdapterUser {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    email: string;
    role?: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role?: string;
    firstname?: string | null;
    lastname?: string | null;
    image?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

type AdapterSession = {
  sessionToken: string;
  userId: string;
  expires: Date;
};

type AssistanceRecord = z.infer<typeof assistanceRecordSchema>;

type WhosOnlineObjectType = {
  id: string;
  email: string;
  firstname: string | null;
  role: 'user' | 'admin' | 'staff';
  task_title: string | null;
  task_started: Date | null;
  task_status: string | null;
  task_ended: Date | null;
  task_priority: string | null;
  company_position: string | null;
  loggedInAt: Date | null;
  loggedOutAt: Date | null;
  isOnline: boolean | null;
};

type DailyTaskTrackerType = {
  id: string;
  email: string;
  firstname: string | null;
  role: 'user' | 'admin' | 'staff';
  task_title: string | null;
  task_desc: string | null;
  task_day: string | null;
  task_started: Date | null;
  task_status: string | null;
  task_ended: Date | null;
  task_priority: string | null;
  company_position: string | null;
  loggedInAt: Date | null;
  loggedOutAt: Date | null;
  isOnline: boolean | null;
};

type userTaskType = {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  startedAt: Date;
  endsAt: Date | null;
  status: string;
};

type UsersType = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'staff';
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type PostsType = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  published: boolean | null;
  publishedAt: Date | null;
  endDate: Date | null;
  updatedAt: Date;
};
