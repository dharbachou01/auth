import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


const authOptions = {
  providers: [
    CredentialsProvider({
      // MUST HAVE (it is used in singIn())
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {label: "Username", type: "text", placeholder: "jsmith"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials) {
        console.log("authorize", credentials);
        const res = await fetch(process.env.AUTH_URL as string, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {"Content-Type": "application/json"}
        })
        const data = await res.json()

        if (res.ok && data) {
          return data
        }

        return null
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async jwt({token, user}) {
      console.log("jwt");
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    redirect({url, baseUrl}: { url: any; baseUrl: any }): string | string {
      console.log("redirect", url, baseUrl);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async session({ session, token, user }) {
      console.log("session");
      return session;
    },
  },
  // set up custom pages https://next-auth.js.org/configuration/options#pages
  pages: {
    signIn: "/signin",
  },
  // для jwt session
  secret: process.env.SECRET_SECRET,
};


const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
