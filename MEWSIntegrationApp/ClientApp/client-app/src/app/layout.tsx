import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) 
{
    return (
        <html lang="en">
        <body>
        <div>
            <nav className="p-4 bg-gray-800 text-white">
                <Link href="/" className="mr-4">Home</Link>
                <Link href="/reservations">Reservations</Link>
            </nav>
            <main className="p-4">{children}</main>
        </div>
        {/*<nav className="p-4 bg-gray-800 text-white">*/}
        {/*    <a href="/" className="mr-4">Home</a>*/}
        {/*    <a href="/reservations">Reservations</a>*/}
        {/*</nav>*/}
        {/*<main className="p-4">{children}</main>*/}
        </body>
        </html>
    );
}