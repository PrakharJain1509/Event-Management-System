import "./globals.css"
import { Inter } from "next/font/google"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Chatbot from "../components/Chatbot"
import { AuthProvider } from "../contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "College Event Management System",
  description: "Manage and book college events",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header Section */}
            <Header />

            {/* Main Content Section */}
            <main className="flex-grow container mx-auto px-6 py-8">
              {children}
            </main>

            {/* Footer Section */}
            <Footer />

            {/* Chatbot positioned at the bottom right corner */}
            <div className="fixed bottom-4 right-4 z-50">
              <Chatbot />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
