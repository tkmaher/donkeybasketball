import type { Metadata } from "next";
import "@/app/styles/globals.scss";
import Main from "@/components/main";



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Main>
          {children}
        </Main>
      </body>
    </html>
  );
}
