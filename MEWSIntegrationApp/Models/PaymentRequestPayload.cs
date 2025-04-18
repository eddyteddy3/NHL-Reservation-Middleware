namespace MEWSIntegrationApp.Models;

public record PaymentRequestPayload(
    string ReservationId,
    string AccountId,
    double Amount,
    string Reason,
    string ExpirationDate,
    string Description,
    string? Notes
);