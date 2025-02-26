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