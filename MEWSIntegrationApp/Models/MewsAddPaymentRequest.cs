namespace MEWSIntegrationApp.Models;

public record MewsAddPaymentRequest
{
    public required string ClientToken { get; set; }
    public required string AccessToken { get; set; }
    public required string Client { get; set; }
    public required MewsPaymentRequest[] PaymentRequests { get; set; }
}

public record MewsPaymentRequest
// (
//     string accountId,
//     string reservationId,
//     MewsPaymentAmount amount,
//     string reason,
//     string expirationUtc,
//     string description,
//     string? notes
//     )
{
    public required string AccountId { get; set; }
    public required MewsPaymentAmount Amount { get; set; }
    public required string Type { get; set; }
    public required string Reason { get; set; }
    public required string ExpirationUtc { get; set; }
    public required string ReservationId { get; set; }
    public required string Description { get; set; }
    public string? Notes { get; set; }
}

public record MewsPaymentAmount
{
    public double Value { get; set; }
    public string Currency { get; set; } = "EUR";
}