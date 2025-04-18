namespace MEWSIntegrationApp.Models;

public record MewsCreatePaymentRequestResponse
{
    public required MewsPaymentRequestResponse[] PaymentRequests { get; set; }
}

public record MewsPaymentRequestResponse(string Id);