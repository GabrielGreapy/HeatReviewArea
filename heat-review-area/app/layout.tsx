import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InputSearchProvider } from "./context/InputSearchContext";
import { MapLocationContextProvider } from "./context/MapLocationContext";
import Header from "./components/site-components/header";
import Script from "next/script";
import Footer from "./components/site-components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThermoTurismo",
  description: "Check out your surroudings in your travels :D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {

  
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://googleapis.com"
          rel="stylesheet"
        />
        <style>{`
          @layer base {
            html,
            body {
              margin: 0;
              padding: 0;
            }

            body {
              overscroll-behavior: none;
            }

            main > :first-child {
              margin-top: 0 !important;
            }

            main > :last-child {
              margin-bottom: 0 !important;
            }
          }

          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_TOKEN}&libraries=places`}
          strategy="beforeInteractive"
        />

      </head>

      <body className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed m-0 p-0 overscroll-behavior-none"
      >        

        
          <Header />
          <main className="w-full pt-16 bg-background min-h-[calc(100vh-140px)]">
            <InputSearchProvider>
              <MapLocationContextProvider>
                
                  {children}
                
              </MapLocationContextProvider>
            </InputSearchProvider>
          </main>
          <Footer />
          
      </body>

    </html>
  );
}
