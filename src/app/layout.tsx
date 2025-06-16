import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AIAssistant from '../components/AIAssistant'
import { AuthProvider } from '@/contexts/AuthContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "IRCAD Assistant - Technical Excellence Platform",
  description: "AI-powered technical support for IRCAD Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-red-500`}>
        <AuthProvider>
          {children}
          {/* AI Assistant available on ALL pages */}
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}