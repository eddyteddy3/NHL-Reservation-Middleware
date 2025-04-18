namespace MEWSIntegrationApp.Models;

public class MewsRateRequest
{
    public string ClientToken { get; set; }
    public string AccessToken { get; set; }
    public string Client { get; set; }
    public string[] RateIds { get; set; }
    public string[] ActivityStatuses { get; set; } = ["Active"]; 
    public Limitation Limitation { get; set; }
}

/* 
{
       "ClientToken": "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
       "AccessToken": "C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D",
       "Client": "MEWSIntegrationApp",
       "PaymentRequests": [
           {
               "AccountId": "ae295d51-607c-48e9-9ab4-b2b7012701f9",
               "Amount": {
                   "Currency": "EUR",
                   "Value": 10
               },
               "Type": "Payment",
               "Reason": "Prepayment",
               "ExpirationUtc": "2025-04-20T12:00:00.000Z",
               "Description": "Payment required",
               "ReservationId": "dae50732-38cb-4e45-8eb2-b2bc01437522",
               "Notes": "some internal notes"
           }
       ]
   }
   */