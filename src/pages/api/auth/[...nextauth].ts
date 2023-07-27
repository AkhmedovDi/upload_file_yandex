import NextAuth from 'next-auth';
import YandexProvider from "next-auth/providers/yandex";




export default NextAuth({
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
      async jwt({token, user, account}) {
      if (user) {
        token.accessToken = account?.access_token;
      }
      return token;
    },
    async session({session, token}) {
      session.accessToken = token.accessToken as any;
      return session;
    },
  },
});