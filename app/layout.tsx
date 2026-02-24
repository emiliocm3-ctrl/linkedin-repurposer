import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinkedIn Content Repurposer - AI-Powered Content Transformation",
  description: "Transform your LinkedIn posts into Twitter threads, blog articles, and newsletters instantly with AI. Save hours of content creation time.",
  keywords: "LinkedIn, content repurposing, AI writing, Twitter threads, blog posts, newsletters, content marketing",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
