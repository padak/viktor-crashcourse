import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Life Coach App | Tvůj osobní kouč",
  description: "AI asistent, který ti pomůže identifikovat problémy a získat personalizovaná doporučení pro lepší život.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen`}
      >
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">🧭</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Life Coach App
                </h1>
                <p className="text-xs text-gray-500">Tvůj osobní průvodce</p>
              </div>
            </div>
          </div>
        </header>
        <main className="py-8">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-gray-400">
          <p>Powered by Claude AI</p>
        </footer>
      </body>
    </html>
  );
}
