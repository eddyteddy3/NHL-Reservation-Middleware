'use client'

import {useEffect, useState} from 'react'
import {useParams, useSearchParams} from 'next/navigation'

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
        
        const amount: number = Number(amnt)

        console.log("params: ")
        console.log(reservationId)
        console.log(accId)
        console.log(amount)
        console.log(paymentExpirationDate)

        try {
            const res = await fetch(`/api/create-payment-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        ReservationId: reservationId,
                        AccountId: accId,
                        Amount: amount,
                        ExpirationDate: paymentExpirationDate,
                        Reason: "Prepayment",
                        Description: "Please pay upfront"
                    }
                ),
            })

            const data = await res.json()

            if (res.ok && data.requestId) {
                // url to redirect -> 
                // https://app.mews-demo.com/navigator/payment-requests/detail/
                
                const requestId: string = data.requestId
                window.location.href = "https://app.mews-demo.com/navigator/payment-requests/detail/" + requestId
                
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
