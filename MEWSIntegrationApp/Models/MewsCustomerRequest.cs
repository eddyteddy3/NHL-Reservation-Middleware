namespace MEWSIntegrationApp.Models;

public record MewsCustomerRequest
{
    public string ClientToken { get; set; }
    public string AccessToken { get; set; }
    public string Client { get; set; }
    public string[] CustomerIds { get; set; }
    public Limitation Limitation { get; set; }
}