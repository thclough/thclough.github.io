import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ActiveSectionContextProvider from "@/context/ActiveSectionContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ThemeSwitch from "@/components/ThemeSwitch";
import ThemeContextProvider from "@/context/ThemeContext";
import ChatActiveContextProvider from "@/context/ChatActiveContext";
import ChatBtn from "@/components/chat/ChatBtn";
import ChatPopper from "@/components/chat/ChatPopper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tighe Clough",
  description: "Tighe Clough's website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="icon" href="/icon.ico" />
      </head>
      <body
        className={`${inter.className} 
      relative bg-gray-50 text-gray-950 pt-28 sm:pt-30 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"></div>
        <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"></div>

        {/* Not everything becomes a client component if you use the children prop */}
        <ChatActiveContextProvider>
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              <Header />
              <Toaster position="top-right" reverseOrder={false} />
              {children}
              <Footer />

              <ChatPopper />
              <ChatBtn />
              <ThemeSwitch />
            </ActiveSectionContextProvider>
          </ThemeContextProvider>
        </ChatActiveContextProvider>
      </body>
    </html>
  );
}
