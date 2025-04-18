"use client";
import { useState, useEffect } from "react";

interface Reservation {
    Id: string;
    ServiceId: string;
    AccountId: string;
    AccountType: string;
    CreatorProfileId: string;
    UpdaterProfileId: string;
    BookerId: string;
    Number: string;
    State: string;
    Origin: string;
    CreatedUtc: Date;
    UpdatedUtc: Date;
    CancelledUtc: Date;
    Options: {
        OwnerCheckedIn: boolean;
        AllCompanionsCheckedIn: boolean;
        AnyCompanionCheckedIn: boolean;
    };
    RateId: string;
    GroupId: string;
    RequestedResourceCategoryId: string;
    AssignedResourceId: string;
    AssignedResourceLocked: boolean;
    ChannelNumber: string;
    ChannelManagerNumber: string;
    StartUtc: Date;
    EndUtc: Date;
    Purpose: string;
    PersonCounts: PersonCount;
}

interface PersonCount {
    AgeCategoryId: string;
    Count: number;
}

interface Customer {
    Id: string ;
    ChainId: string ;
    Number: string ;
    Title: string ;
    Sex: string ;
    Gender: string ;
    FirstName: string  ;
    LastName: string ;
    SecondLastName: string  ;
    NationalityCode: string  ;
    PreferredLanguageCode: string ;
    LanguageCode: string ;
    BirthDate: string  ;
    BirthPlace: string  ;
    Occupation: string  ;
    Email: string ;
    HasOtaEmail: boolean ;
    Phone: string  ;
    TaxIdentificationNumber: string  ;
    LoyaltyCode: string  ;
    AccountingCode: string  ;
    BillingCode: string  ;
    Notes: string  ;
    CarRegistrationNumber: string  ;
    DietaryRequirements: string  ;
    CreatedUtc: Date;
    UpdatedUtc: Date;
    Passport: string  ;
    IdentityCard: string  ;
    Visa: string  ;
    DriversLicense: string  ;
    Address: string  ;
    AddressId: string  ;
    Classifications: string ;
    Options: string[];
    CategoryId: string  ;
    BirthDateUtc: string  ;
    ItalianDestinationCode: string  ;
    ItalianFiscalCode: string  ;
    CompanyId: string  ;
    MergeTargetId: string  ;
    ActivityState: string ;
    IsActive: boolean ;
    IsUpdatedByMe: string  ;
    PreferredSpaceFeatures: string[] ;
}

interface ReservationDetailDto {
    Id: string;
    TotalAmount: string;
    Products: string[];
    NumberOfAdults: string;
}

interface ReservationRateDto {
    Rates: Rate[];
}

interface Rate {
    Id: string;
    Name: string;
    ShortName: string;
    ExternalIdentifier: string;
}

interface ReservationDetails {
    Reservation: Reservation[];
    Customer: Customer[];
    ReservationDetails: ReservationDetailDto;
    ReservationRate: ReservationRateDto;
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<ReservationDetails | null>(null);
    const [emailHtml, setEmailHtml] = useState("");
    const [shouldAddRate, setShouldAddRate] = useState(false);
    const [shouldAddProduct, setShouldAddProduct] = useState(false);
    const [shouldAddTotalAmount, setShouldAddTotalAmount] = useState(false);
    const [remarks, setRemarks] = useState("");

    // payment request
    const [paymentAmount, setPaymentAmount] = useState(0.0);
    const [paymentRequestId, setPaymentRequestId] = useState("");
    const [shouldIncludePaymentRequest, setShouldIncludePaymentRequest] = useState(false);
    const [paymentExpirationDate, setPaymentExpirationDate] = useState<string>("");

    useEffect(() => {
        
    const eventSource = new EventSource("/api/mews/subscriptions/reservations");

    eventSource.onopen = () => {
        console.log("Connection established");
    };

    eventSource.onmessage = (event) => {
        console.log("Event received", event.data);

        if (event.data) {
            try {
                const updatedData: ReservationDetails = JSON.parse(event.data);

                updateEmailTemplate(
                    updatedData,
                    shouldAddRate,
                    shouldAddProduct,
                    shouldAddTotalAmount,
                    shouldIncludePaymentRequest,
                    remarks);
                setReservations(updatedData);

            } catch (error) {
                console.error("❌ JSON Parsing Error:", error);
            }
        }
    };

    eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
    };
        
    return () => {
        eventSource.close(); // Close the connection when the component is unmounted (cleanup)
    };

    }, []);

    const updateEmailTemplate = (
        data: ReservationDetails,
        rate: boolean,
        product: boolean,
        totalAmount: boolean,
        shouldAddPaymentRequest: boolean,
        remarks: string) => {

        if (!data) return;

        var reservationRate = data.ReservationRate.Rates[0].Name;
        var reservationProduct = data.ReservationDetails.Products.map((product) => product).join(", ");
        var reservationTotalAmount = data.ReservationDetails.TotalAmount;
        var requestPaymentUrl = "https://app.mews-demo.com/navigator/payment-requests/detail/" + paymentRequestId;

        let details = "";
        if (rate) details += "<p>Rate: " + reservationRate + "</p>";
        if (product) details += "<p>Product: " + reservationProduct + "</p>";
        if (totalAmount) details += "<p>Total Amount: " + reservationTotalAmount + "</p>";
        if (remarks) details += "<p>Remarks: " + remarks + "</p>";

        let template = emailTemplate
            .replace("{FirstName}", "Test")
            .replace("{LastName}", data.Customer[0].LastName)
            .replace("{EnterpriseName}", "Notiz Hotel")
            .replace("{detailsHtml}", details)
            .replace("{paymentLink}", requestPaymentUrl); // add the logic to the button based on the ccondition

        setEmailHtml(template);
        navigator.clipboard.writeText(template);
        console.log(template);
    };


    const handleCheckboxChange = (type: string) => {
        let newRate = shouldAddRate;
        let newProduct = shouldAddProduct;
        let newTotalAmount = shouldAddTotalAmount;
        let newPaymentRequest = shouldIncludePaymentRequest;

        if (type === "rate") newRate = !newRate;
        if (type === "product") newProduct = !newProduct;
        if (type === "totalAmount") newTotalAmount = !newTotalAmount;
        if (type === "paymentRequest") newPaymentRequest = !newPaymentRequest;

        setShouldAddRate(newRate);
        setShouldAddProduct(newProduct);
        setShouldAddTotalAmount(newTotalAmount);
        setShouldIncludePaymentRequest(newPaymentRequest);

        if (reservations) {
            updateEmailTemplate(
                reservations,
                newRate,
                newProduct,
                newTotalAmount,
                newPaymentRequest,
                remarks);
        }
    };

    const handleAddPaymentRequest = async () => {
        console.log("about to call the payment request");

        try {
            const res = await fetch("/api/create-payment-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        ReservationId: reservations?.Reservation[0].Id,
                        AccountId: reservations?.Reservation[0].AccountId,
                        Amount: paymentAmount,
                        ExpirationDate: paymentExpirationDate,
                        Reason: "Prepayment",
                        Description: "Please pay upfront"
                    }
                ),
            });

            if (res.ok) {
                const result = await res.json();
                setPaymentRequestId(result.requestId); // assuming backend returns { requestId }
            } else {
                console.error("Failed to create payment request");
            }
        } catch (error) {
            console.error("Error creating payment request", error);
        }
    };


    const handleRemarksChange = (text: string) => {
        setRemarks(text);

        if (reservations) {
            updateEmailTemplate(
                reservations,
                shouldAddRate,
                shouldAddProduct,
                shouldAddTotalAmount,
                shouldIncludePaymentRequest,
                text
            );
        }
    };

    if (!reservations) {
        return <div>
            <h2 className="text-xl font-bold mb-2">
                No reservations for now...
            </h2>
        </div>;
    }

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-2">Reservation #{reservations.Reservation[0].Number}</h2>
            <p>Customer: {reservations.Customer[0].LastName} ({reservations.Customer[0].Email})</p>
            <p>State: {reservations.Reservation[0].State}</p>
            <p>Start: {new Date(reservations.Reservation[0].StartUtc).toLocaleString()}</p>
            <p>End: {new Date(reservations.Reservation[0].EndUtc).toLocaleString()}</p>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                    Payment Amount (€)
                </label>
                <input
                    type="number"
                    className="mt-1 p-2 border w-full rounded-md"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    placeholder="Enter payment amount"
                />

                <button 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleAddPaymentRequest}
                    disabled={!paymentAmount && !paymentExpirationDate}>
                    Add payment request</button>
            </div>

            <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                    Payment Expiration Date (UTC)
                </label>
                <input
                    type="datetime-local"
                    className="mt-1 p-2 border w-full rounded-md"
                    value={paymentExpirationDate.slice(0, 16)} // ✨ trims to "YYYY-MM-DDTHH:mm"
                    min={new Date().toISOString().slice(0, 16)}
                    max={new Date(reservations.Reservation[0].EndUtc).toISOString().slice(0, 16)}
                    onChange={(e) => {
                        const localDate = new Date(e.target.value);
                        const utcDate = new Date(localDate.toISOString());
                        setPaymentExpirationDate(utcDate.toISOString()); // Store in UTC format
                    }}
                />
                <small className="text-gray-500">
                    Must be on or before {new Date(reservations.Reservation[0].EndUtc).toLocaleDateString()}
                </small>
            </div>
            <div className="mt-4">
                <label className="flex items-center">
                    <input type="checkbox" 
                        checked={shouldAddRate}
                        onChange={() => handleCheckboxChange("rate")}
                        className="mr-2" />
                    Add rate (<b><i>{reservations.ReservationRate.Rates[0].Name}</i></b>)
                </label>
                <label className="flex items-center">
                    <input 
                        type="checkbox"
                        checked={shouldAddProduct}
                        onChange={() => handleCheckboxChange("product")}
                        className="mr-2" />
                    Add product (<b><i>{reservations.ReservationDetails.Products.map((product) => product).join(", ")}</i></b>)
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={shouldAddTotalAmount}
                        onChange={() => handleCheckboxChange("totalAmount")}
                        className="mr-2" />
                    Add total amount (<b><i>{reservations.ReservationDetails.TotalAmount}</i></b>)
                </label>

                {paymentRequestId && (
                    <label className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            checked={shouldIncludePaymentRequest}
                            onChange={() => {
                                handleCheckboxChange("paymentRequest")
                            }}
                            className="mr-2"
                        />
                        Include payment request link in email
                    </label>
                )}

                {/* Remarks Input Field */}
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                    Remarks
                </label>
                <textarea
                    className="mt-1 p-2 border w-full rounded-md"
                    rows={3}
                    value={remarks}
                    onChange={(e) => handleRemarksChange(e.target.value)}
                    placeholder="Add any special remarks for this reservation..."
                />
                </div>
            </div>

            {emailHtml && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Email Preview</h2>
                    <iframe
                        srcDoc={emailHtml}
                        className="w-full h-[500px] border rounded"
                    />
                </div>
            )}
        </div>
    );
}

// var newEmailTemplate = 

var emailTemplate = `
<div style="text-align: center;">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <style>
        @font-face {
          font-family: Helvetica;
        }
        @font-face {
          font-family: "Calibri", sans-serif;
        }
        .button {
          background-color: #541E1E;
          border: none;
          color: white;
          padding: 12px 24px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin-top: 20px;
          cursor: pointer;
          border-radius: 4px;
        }
      </style>
    </head>

    <body style="font-family:'Calibri', sans-serif; background-color: #EEEEEE; margin:0; padding:0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        <img src="https://cdn.mews.li/Media/Image/423ac551-8b0c-4a2a-83d1-ac73014894ae?Mode=FitExact&Height=160&Width=320" width="320" height="160" alt="Notiz Logo" style="margin-bottom: 20px;">

        <div style="background-color: #541E1E; color: white; padding: 15px 0;">
          <h2 style="margin: 0;">Welcome to Notiz Hotel!</h2>
        </div>

        <div style="background-color: #DADCDD; padding: 15px;">
          <img src="https://cdn.mews.com/Media/Image/e0b02a17-f18b-4662-8d50-b0df00df4aff" width="100%" alt="Hotel Image" style="margin-bottom: 20px;">
        </div>

        <div style="padding: 20px;">
          <h3 style="color: #541E1E;">Thank you for your reservation!</h3>
          <p>
            Dear {FirstName} {LastName},<br><br>
            Many thanks for reserving your stay at <strong>{EnterpriseName}</strong> in Leeuwarden. We hope you are just as excited as we are!<br><br>
            We hereby happily confirm the following:
          </p>

          <div>{detailsHtml}</div>

          <p>
            We would like to wish you a safe journey to Leeuwarden and of course a wonderful stay at <strong>{EnterpriseName}</strong>.
          </p>

          <!-- 🔘 Payment Button -->
          <div style="text-align: center;">
            <a href="{paymentLink}" class="button">Complete Payment</a>
          </div>
        </div>

        <hr style="border-top: 1.5pt solid #541E1E; margin-top: 30px;">
      </div>
    </body>
  </html>
</div>
`;