import type {Metadata} from "next";
import "./globals.css";
import Link from "next/link";
export const metadata: Metadata = {
    title: "Reservations",
    description: "i don't lose, I WIN!!!",
};

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


/*


    const updateEmailHtml = (reservation: ReservationDetails) => {
        let details = "";
        if (shouldAddProduct) details += "<p>Product: " + "Breakfast included" + "</p>";
        if (shouldAddRate) details += "<p>Rate: " + "€150 per night" + "</p>";
        if (shouldAddTotalAmount) details += "<p>Total Amount: " + "€220" + "</p>";

        let template = emailTemplate
            .replace("{FirstName}", "Test")
            .replace("{LastName}", reservation.Customer[0].LastName)
            .replace("{EnterpriseName}", "Notiz Hotel")
            .replace("{detailsHtml}", details);

        setEmailHtml(template);
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        if (name === "rate") {
            setShouldAddRate(checked);
        } else if (name === "product") {
            setShouldAddProduct(checked);
        }
        else if (name === "totalAmount") {
            setShouldAddTotalAmount(checked);
        }
    
        if (reservations && reservations.Reservation) {
            updateEmailHtml(reservations);
        }
    };
    */