import type { Metadata } from "next"
import localFont from 'next/font/local'
import "./globals.css"
import { Providers } from "./providers"
import Appbar from "@/components/Appbar"

const poppins = localFont({
    src: '../../public/Poppins-Regular.ttf',
})

export const metadata: Metadata = {
    title: "YourSpace",
    description: "Your own space in your browser!",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
        <body className={`${poppins.className} antialiased`}>
            <Providers>
                <div className="p-3">
                    <Appbar />
                    {children}
                </div>
            </Providers>
        </body>
    </html>
}
