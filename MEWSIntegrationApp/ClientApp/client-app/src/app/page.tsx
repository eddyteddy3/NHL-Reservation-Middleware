"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

interface ReservationDetails {
    Reservation: Reservation[];
    Customer: Customer[];
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<ReservationDetails | null>(null);
    const [emailHtml, setEmailHtml] = useState("");
    const [shouldAddRate, setShouldAddRate] = useState(false);
    const [shouldAddProduct, setShouldAddProduct] = useState(false);
    const [shouldAddTotalAmount, setShouldAddTotalAmount] = useState(false);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        
    const eventSource = new EventSource("/api/mews/subscriptions/reservations");

    eventSource.onopen = () => {
        console.log("Connection established");
    };

    eventSource.onmessage = (event) => {
        console.log("Event received", event.data);

        // const reservation = JSON.parse(event.data);
        // setReservations(reservation);

        if (event.data) {
            try {
                const updatedData: ReservationDetails = JSON.parse(event.data);
                
                // let template = emailTemplate
                //     .replace("{FirstName}", "Test")
                //     .replace("{LastName}", updatedData.Customer[0].LastName)
                //     .replace("{EnterpriseName}", "Notiz Hotel")
                //     .replace("{detailsHtml}", "<p>Reservation Number: " + updatedData.Reservation[0].Number + "</p>" + "(MORE DATA CAN BE ADDED)");
                // setEmailHtml(template);


                updateEmailTemplate(updatedData, shouldAddRate, shouldAddProduct, shouldAddTotalAmount);
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
        remarks: string) => {

        if (!data) return;

        let details = "";
        if (rate) details += "<p>Rate: " + "€150 per night" + "</p>";
        if (product) details += "<p>Product: " + "Breakfast included" + "</p>";
        if (totalAmount) details += "<p>Total Amount: " + "€220" + "</p>";
        if (remarks) details += "<p>Remarks: " + remarks + "</p>";

        let template = emailTemplate
            .replace("{FirstName}", "Test")
            .replace("{LastName}", data.Customer[0].LastName)
            .replace("{EnterpriseName}", "Notiz Hotel")
            .replace("{detailsHtml}", details);

        setEmailHtml(template);
    };


    const handleCheckboxChange = (type: string) => {
        let newRate = shouldAddRate;
        let newProduct = shouldAddProduct;
        let newTotalAmount = shouldAddTotalAmount;

        if (type === "rate") newRate = !newRate;
        if (type === "product") newProduct = !newProduct;
        if (type === "totalAmount") newTotalAmount = !newTotalAmount;

        setShouldAddRate(newRate);
        setShouldAddProduct(newProduct);
        setShouldAddTotalAmount(newTotalAmount);

        if (reservations) {
            updateEmailTemplate(reservations, newRate, newProduct, newTotalAmount, remarks);
        }
    };

    const handleRemarksChange = (text: string) => {
        setRemarks(text);

        if (reservations) {
            updateEmailTemplate(reservations, shouldAddRate, shouldAddProduct, shouldAddTotalAmount, text);
        }
    };

    if (!reservations) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-2">Reservation #{reservations.Reservation[0].Number}</h2>
            <p>Customer: {reservations.Customer[0].LastName} ({reservations.Customer[0].Email})</p>
            <p>State: {reservations.Reservation[0].State}</p>
            <p>Start: {new Date(reservations.Reservation[0].StartUtc).toLocaleString()}</p>
            <p>End: {new Date(reservations.Reservation[0].EndUtc).toLocaleString()}</p>
            <div className="mt-4">
                <label className="flex items-center">
                    <input type="checkbox" 
                        checked={shouldAddRate}
                        onChange={() => handleCheckboxChange("rate")}
                        className="mr-2" />
                    Add rate
                </label>
                <label className="flex items-center">
                    <input 
                        type="checkbox"
                        checked={shouldAddProduct}
                        onChange={() => handleCheckboxChange("product")}
                        className="mr-2" />
                    Add product
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={shouldAddTotalAmount}
                        onChange={() => handleCheckboxChange("totalAmount")}
                        className="mr-2" />
                    Add total amount
                </label>

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

var emailTemplate = `
<div style="text-align: center;">

                <html>

 

<head>

<meta http-equiv=Content-Type content="text/html; charset=utf-8">

<meta name=Generator content="Microsoft Word 15 (filtered)">

<style>

<!--

/* Font Definitions */

@font-face

              {font-family:Helvetica;

              panose-1:2 11 6 4 2 2 2 2 2 4;}

@font-face

              {font-family:"Cambria Math";

              panose-1:2 4 5 3 5 4 6 3 2 4;}

@font-face

              {font-family:Calibri;

              panose-1:2 15 5 2 2 2 4 3 2 4;}

@font-face

              {font-family:"Calibri",sans-serif;}

/* Style Definitions */

p.MsoNormal, li.MsoNormal, div.MsoNormal

              {margin-top:0in;

              margin-right:0in;

              margin-bottom:8.0pt;

              margin-left:0in;

              line-height:107%;

              font-size:11.0pt;

              font-family:"Calibri",sans-serif;}

a:link, span.MsoHyperlink

              {font-family:"Calibri",sans-serif;

              color:blue;

              text-decoration:underline;}

.MsoChpDefault

              {font-family:"Calibri",sans-serif;}

.MsoPapDefault

              {margin-bottom:8.0pt;

              line-height:107%;}

@page WordSection1

              {size:595.3pt 841.9pt;

              margin:70.85pt 70.85pt 70.85pt 70.85pt;}

div.WordSection1

              {page:WordSection1;}

-->

</style>

 

</head>

 

<body lang=EN-US link=blue vlink="#954F72" style='word-wrap:break-word'>

 

<div class=WordSection1>

 

<p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;

line-height:normal'><span style='font-size:11.5pt;font-family:"Calibri",sans-serif;

color:#333333'><img width=320 height=160

src=https://cdn.mews.li/Media/Image/423ac551-8b0c-4a2a-83d1-ac73014894ae?Mode=FitExact&amp;Height=160&amp;Width=320></span></p>

 

<div align=center>

 

<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width="100%"

style='width:100.0%;border-collapse:collapse'>

<tr>

  <td width="100%" valign=top style='width:100.0%;background:#EEEEEE;

  padding:7.5pt 7.5pt 7.5pt 7.5pt'>

  <div align=center>

  <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width=600

   style='width:6.25in;border-collapse:collapse'>

   <tr>

    <td width=600 valign=top style='width:6.25in;padding:0in 0in 0in 0in'>

    <div align=center>

    <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

     width="100%" style='width:100.0%;border-collapse:collapse'>

     <tr>

      <td valign=top style='background:#541E1E;padding:6.0pt 0in 6.0pt 0in'>

      <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;

      line-height:normal'><b><span style='font-size:18.0pt;color:white'>Welcome

      to Notiz Hotel!</span></b></p>

      </td>

     </tr>

     <tr>

      <td valign=top style='background:#DADCDD;padding:6.75pt 0in 0in 0in'>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td valign=top style='padding:6.75pt 6.75pt 6.75pt 6.75pt'>

        <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

         align=left width="100%" style='width:100.0%;border-collapse:collapse;

         margin-left:-2.25pt;margin-right:-2.25pt'>

         <tr>

          <td valign=top style='padding:0in 6.75pt 0in 6.75pt'>

          <p class=MsoNormal align=center style='margin-bottom:0in;text-align:

          center;line-height:normal'><img width=605 height=365 id="Afbeelding 7"

          src=https://cdn.mews.com/Media/Image/e0b02a17-f18b-4662-8d50-b0df00df4aff></p>

          </td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      </td>

     </tr>

     <tr>

      <td valign=top style='background:white;padding:0in 0in 3.75pt 0in'>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td valign=top style='padding:6.75pt 0in 0in 0in'>

        <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

         align=left width="100%" style='width:100.0%;border-collapse:collapse;

         margin-left:-2.25pt;margin-right:-2.25pt'>

         <tr>

          <td width=600 valign=top style='width:6.25in;padding:0in 0in 0in 0in'>

          <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

           align=left width="100%" style='width:100.0%;border-collapse:collapse;

           margin-left:-2.25pt;margin-right:-2.25pt'>

           <tr>

            <td valign=top style='padding:0in 13.5pt 6.75pt 13.5pt'>

            <p class=MsoNormal style='margin-bottom:0in;line-height:125%'><b><span

            style='font-size:15.0pt;line-height:125%;font-family:"Calibri",sans-serif;

            color:#541E1E'>Thank you for your reservation!</span></b></p>

            <p class=MsoNormal style='margin-bottom:0in;line-height:150%'><span

            style='font-size:11.5pt;line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'>Dear {FirstName} {LastName},<br>

            <br>

            Many thanks for reserving your stay at <b>{EnterpriseName} </b>in

            Leeuwarden. We hope you are just as excited as we are!<br>

            <br>

            We hereby happily confirm the following:</span><span

            style='font-size:11.5pt;line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'> </span></p>

            <div>

            <p class=MsoNormal style='margin-bottom:0in;line-height:150%'><span

            style='font-size:11.5pt;line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'>{detailsHtml}</span></p>

            <p class=MsoNormal style='margin-bottom:0in;line-height:150%'><span

            style='font-size:11.5pt;line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'>

            <div><br>

            </span><span style='font-size:11.5pt;line-height:150%;font-family:

            "Calibri",sans-serif'>We would like to wish you a safe

            journey to Leeuwarden and of course a wonderful stay at <b>{enterpriseName}</b>.</span></p>

            </td>

           </tr>

          </table>

          </td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span

      style='font-size:11.5pt;font-family:"Calibri",sans-serif;display:none'>&nbsp;</span></p>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td style='padding:3.75pt 13.5pt 3.75pt 13.5pt'>

        <table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0

         width="100%" style='width:100.0%;border-collapse:collapse;border:none'>

         <tr>

          <td style='border:none;border-top:solid #541E1E 1.5pt;padding:0in 0in 0in 0in'></td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span

      style='font-size:11.5pt;font-family:"Calibri",sans-serif;display:none'>&nbsp;</span></p>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td valign=top style='padding:6.75pt 0in 0in 0in'>

        <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

         align=left width="100%" style='width:100.0%;border-collapse:collapse;

         margin-left:-2.25pt;margin-right:-2.25pt'>

         <tr>

          <td width=600 valign=top style='width:6.25in;padding:0in 0in 0in 0in'>

          <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

           align=left width="100%" style='width:100.0%;border-collapse:collapse;

           margin-left:-2.25pt;margin-right:-2.25pt'>

           <tr>

            <td valign=top style='padding:0in 13.5pt 6.75pt 13.5pt'>

            <p class=MsoNormal style='margin-bottom:12.0pt;line-height:100%'><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'>Did you know we have our own app? The Notiz Hotel

            app will make your hotel experience really noteworthy. With the app

            you can control the lighting in the room, order services, read

            about our facilities and even use your smartphone as a room key!

</span></p>

            <p class=MsoNormal style='margin-bottom:12.0pt;line-height:100%'><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'>You can find the app in the <a href=https://apps.apple.com/nl/app/notiz-hotel/id1541129482>App Store</a> and <a href=https://play.google.com/store/apps/details?id=com.hoteza.stenden_hotel>Play Store</a>. Search for <b>{enterpriseName}</b>.</span></p>

            <p class=MsoNormal style='margin-bottom:12.0pt;line-height:100%'><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'><p>To best prepare your stay, take a look at our information page:&nbsp;<a href=https://www.notizhotel.com/en/prepare-your-trip-with-us>Prepare your trip with us! | Notiz Hotel Leeuwarden</a>.</p>In anticipation of your arrival, you can already

            update your profile in advance via below button. Please feel free

            to get in touch with us, should you have any questions or comments

            regarding your booking. We are happy to help!  You can reach us at

            {enterpriseEmail}, or on {enterpriseTelephone}. You can also chat with

            us:</span></p>

            <p class=MsoNormal style='margin-bottom:12.0pt;line-height:150%'><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'>{SignInLink} {chatLink}</span></p>

            <p class=MsoNormal style='margin-bottom:12.0pt;line-height:150%'><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'>Our cancellation policy is applicable to this

            reservation. You can find this on </span><span lang=NL><a

            href=https://www.notizhotel.com/en/cancellation-policy><span

            lang=EN-US style='font-size:11.5pt;line-height:100%;font-family:

            "Calibri",sans-serif;color:#541E1E'>https://www.notizhotel.com/en/cancellation-policy</span></a></span><span

            style='font-size:11.5pt;line-height:100%;font-family:"Calibri",sans-serif;

            color:#202020'>.</span></p>

            </td>

           </tr>

          </table>

          </td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span

      style='font-size:11.5pt;font-family:"Calibri",sans-serif;display:none'>&nbsp;</span></p>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td style='padding:3.75pt 13.5pt 3.75pt 13.5pt'>

        <table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0

         width="100%" style='width:100.0%;border-collapse:collapse;border:none'>

         <tr>

          <td style='border:none;border-top:solid #541E1E 1.5pt;padding:0in 0in 0in 0in'></td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span

      style='font-size:11.5pt;font-family:"Calibri",sans-serif;display:none'>&nbsp;</span></p>

      <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

       width="100%" style='width:100.0%;border-collapse:collapse'>

       <tr>

        <td valign=top style='padding:6.75pt 0in 0in 0in'>

        <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

         align=left width="100%" style='width:100.0%;border-collapse:collapse;

         margin-left:-2.25pt;margin-right:-2.25pt'>

         <tr>

          <td width=600 valign=top style='width:6.25in;padding:0in 0in 0in 0in'>

          <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0

           align=left width="100%" style='width:100.0%;border-collapse:collapse;

           margin-left:-2.25pt;margin-right:-2.25pt'>

           <tr>

            <td valign=top style='padding:0in 13.5pt 6.75pt 13.5pt'>

            <p class=MsoNormal align=center style='margin-bottom:0in;

            text-align:center;line-height:150%'><span style='font-size:11.5pt;

            line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'>Kind regards,</span><span style='font-size:11.5pt;

            line-height:150%;font-family:"Calibri",sans-serif;color:#202020'><br>

            </span><b><span style='font-size:15.0pt;line-height:150%;

            font-family:"Calibri",sans-serif;color:#541E1E'>{EnterpriseName}</span></b><span

            style='font-size:11.5pt;line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'><br>

            </span><span lang=NL><a

            href=https://u2424399.ct.sendgrid.net/ls/click?upn=xVy4qVUG1AdYP6A1uhSX6xqrxwuv-2B7BAlJ0lckpX9Vgt4znh5uZEn-2BE-2BYVLUbZh-2Bqt9AA0Ye7g8TrwMmXkC3GubmLWHVWHK9aSzI5-2F0nCMAp06oEMxCw6OrPm0YuWp3-2FRkjR_LrZYce3pZIsCvKv0MDxStU7wHc1txpEB6yrKqneM8crFT6fyGA5tgfEMtQkilpBnGkutUAdt5n7nuh7tx5IBj88NfPU-2By68BoASBwh6S-2BK7d6V40EiVUvXR3RRldyMXXsVT2EBM8ks1YPbGej55QZp9ZgJjvJvwiph4clVsJyVeV-2BKbdx5cW3FkESpbPwqYQveIrQwsRPUQXxzzNb-2BTQcCqQXjK8RCMKm-2F04-2FdWkQO68oHBjoGI0GqL5Zoa92HTZwnLGZRWk00GWQDgCnTuqnMhR-2BH7uXE4iAugTqtBipMOR2YWcdnl4Taqj-2Bjo0KeFt-2F74hKaS25q9w6cS3DLCguKEOWrzjA7OgMVNPl00bMUk-3D

            target="_blank"><span lang=EN-US style='font-size:11.5pt;

            line-height:150%;font-family:"Calibri",sans-serif;

            color:black'>Rengerslaan 8 Leeuwarden<br>

            8917 DD Nederland</span></a></span><span style='font-size:11.5pt;

            line-height:150%;font-family:"Calibri",sans-serif;

            color:#202020'><br>

            +31 58 3030 800</span></p>

            </td>

           </tr>

          </table>

          </td>

         </tr>

        </table>

        </td>

       </tr>

      </table>

      <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span

      style='font-size:11.5pt;font-family:"Calibri",sans-serif;display:none'>&nbsp;</span></p>

      </td>

     </tr>

     <tr>

      <td valign=top style='background:#EEEEEE;padding:6.75pt 0in 6.75pt 0in'></td>

     </tr>

    </table>

    </div>

    </td>

   </tr>

  </table>

  </div>

  </td>

</tr>

</table>

 

</div>

 

<p class=MsoNormal>&nbsp;</p>

 

</div>

 

</body>

 

</html>

 

            </div>
`;