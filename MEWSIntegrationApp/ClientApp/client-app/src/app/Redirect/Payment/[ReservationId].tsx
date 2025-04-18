import { useRouter } from 'next/router';
import { useState, useEffect } from "react";

export default function PaymentRedirectPage() {
    const router = useRouter();
    const { reservationId } = router.query;
    const [error, setError] = useState<string | null>(null);

    // fetch create payment request
    const fetchPaymentUrl = async () => {
        if (!reservationId) return;

        try {
            // TODO: change the url
            const result = await fetch('/api/create-payment-request');
            const data = await result.json();


        } catch (err) {
            console.error(err);
            setError("something went wrong while fetching the payment url");
        }
    }

    useEffect(() => {
        fetchPaymentUrl()
    }, [reservationId])

    return (
        <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
            <h1 className="text-2xl font-semibold mb-4">Preparing your payment...</h1>
            {!error ? (
                <p className="text-gray-600">Please wait while we redirect you to the payment page.</p>
            ) : (
                <div className="mt-6">
                    <p className="text-red-600">{error}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        If this keeps happening, please contact our front desk for assistance.
                    </p>
                </div>
            )}
        </div>
    )
}