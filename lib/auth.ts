import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Email (Magic Link) Provider - Using Resend
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: 'Sign in to TechRadars',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <div style="display: inline-block;">
                      <h1 style="color: white; margin: 0; font-size: 28px; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;">
                        <span style="font-weight: 600;">Tech</span><span style="font-weight: 700;">Radars</span>
                      </h1>
                    </div>
                  </div>
                  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1a1a1a; margin-top: 0;">Sign in to your account</h2>
                    <p style="color: #6b7280; margin: 20px 0;">Click the button below to sign in to your TechRadars account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Sign In</a>
                    </div>
                    <p style="color: #9ca3af; font-size: 14px; margin: 20px 0 0 0;">This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.</p>
                  </div>
                  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                    <p>TechRadars - Visualize your technology landscape</p>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (error) {
          console.error('Failed to send verification email:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After login, redirect to landing page where smart redirect logic handles routing
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to landing page for smart redirect
      return baseUrl;
    },
  },
};
