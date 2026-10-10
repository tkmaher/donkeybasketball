import type { Metadata } from "next";
import localFont from "next/font/local";
import "computer-modern/index.css";
import "@/app/styles/globals.scss";
import Main from "@/components/main";

const spaceMono = localFont({
  src: [
    {
      path: "./fonts/SpaceMono-Regular.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SpaceMono-Bold.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SpaceMono-Italic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-space-mono",
  adjustFontFallback: false, 
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>
        <Main>{children}</Main>
      </body>
    </html>
  );
}