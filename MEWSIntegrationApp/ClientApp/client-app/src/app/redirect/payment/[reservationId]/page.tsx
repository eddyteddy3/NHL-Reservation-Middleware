'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSearchParams } from "next/navigation"

export default function PaymentRedirectPage() {
    const { reservationId } = useParams()
    const searchParams = useSearchParams()
    const accId = searchParams.get("accId") ?? ""
    const amnt = searchParams.get("amount") ?? ""
    
    // TODO: safety-checking

    const [error, setError] = useState<string | null>(null)

    const fetchPaymentUrl = async () => {
        if (!reservationId) return

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 24);
        const paymentExpirationDate = currentDate.toISOString();

        console.log("params: ")
        console.log(reservationId)
        console.log(accId)
        console.log(amnt)

        try {
            const res = await fetch(`/api/create-payment-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        ReservationId: reservationId,
                        AccountId: accId,
                        Amount: amnt,
                        ExpirationDate: paymentExpirationDate, // calculate -> current Time + 24h
                        Reason: "Prepayment",
                        Description: "Please pay upfront"
                    }
                ),
            })

            const data = await res.json()

            if (res.ok && data.paymentUrl) {
                window.location.href = data.paymentUrl
            } else {
                setError(data.message || 'Unable to create payment request.')
            }
        } catch (err) {
            console.error(err)
            setError('Something went wrong while creating the payment link.')
        }
    }

    useEffect(() => {
        let _ = fetchPaymentUrl();
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
