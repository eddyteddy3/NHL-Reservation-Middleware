namespace MEWSIntegrationApp.Models;

public record MewsReservationRequest
{
    public string ClientToken { get; set; }
    public string AccessToken { get; set; }
    public string Client { get; set; }
    public string[] ReservationIds { get; set; }
    public Limitation Limitation { get; set; }
}

public record Limitation(int Count);