import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from '@/contexts/AuthContext';
import Chatbot from "@/components/chatbot";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider >
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <main>
          {children}
          </main>
          </AuthProvider>
        </ThemeProvider>
        <Chatbot/>
      </body>
    </html>
  );
}