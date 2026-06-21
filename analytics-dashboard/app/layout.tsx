import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadCycle Analytics Dashboard",
  description: "La plataforma de cobros y mediación de ReadCycle que conecta de forma transparente a compradores y vendedores con total seguridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="flex justify-between items-center px-6 md:px-12 py-2 h-16 bg-brand-sand/20 backdrop-blur-md border-b border-brand-sand/30 sticky top-0 z-50 transition-all duration-300">
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.01] active:scale-[0.99]" id="header-logo-link">
              <Image
                src="/e71ac032-2a49-4210-88e3-a2ea411acb84-removebg-preview.png"
                alt="ReadCycle Logo"
                width={120}
                height={30}
                className="h-7 md:h-8 w-auto object-contain select-none"
                priority
              />
            </Link>
            
            <div className="flex items-center gap-4" id="header-auth-controls">
              <Show when="signed-out">
                <SignInButton>
                  <button className="text-brand-forest hover:text-brand-sage font-medium text-sm sm:text-base px-3 py-2 transition-colors duration-200 cursor-pointer" id="btn-signin">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-brand-forest hover:bg-brand-sage text-brand-beige rounded-full font-medium text-sm sm:text-base h-10 px-5 transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm hover:shadow-md" id="btn-signup">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          
          <main className="flex flex-col flex-1">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
