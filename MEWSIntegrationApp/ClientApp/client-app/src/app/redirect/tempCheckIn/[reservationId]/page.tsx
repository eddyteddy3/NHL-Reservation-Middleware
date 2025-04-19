'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

export default function CheckInTemp() {
    const { reservationId } = useParams()
    const searchParams = useSearchParams()
    const guestName = searchParams.get("name") ?? ""
    const checkInDate = searchParams.get("checkInDate") ?? ""
    
    const [ isCheckedIn, setCheckedIn ] = useState(false)
    
    const handleCheckIn = () => {
        setCheckedIn(true)
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Temporary Custom Check-In</h2>
            <h3 className="text-red-500"><b><i>It will be replaced with MEWS check-in</i></b></h3>
            <h3 className="text-red-500"><b><i>Only for demonstration purpose.</i></b></h3>
            <br/>

            {!isCheckedIn ? (
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Guest Name</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border w-full rounded-md"
                            value={guestName}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Reservation Code</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border w-full rounded-md"
                            value={reservationId}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Check-In Date</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border w-full rounded-md"
                            value={checkInDate}
                            disabled={true}
                        />
                    </div>
                </div>
            ) : (
                <h1> Reservation Confirmed </h1>
            )}

        <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCheckIn}
            hidden={isCheckedIn}
        >
            Check In
        </button>
        </div>
    )
    
}