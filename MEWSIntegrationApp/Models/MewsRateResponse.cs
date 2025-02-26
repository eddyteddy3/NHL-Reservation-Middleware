namespace MEWSIntegrationApp.Models;

public class MewsRateResponse
{
    public Rate[] Rates { get; set; }
}

public class Rate
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? ShortName { get; set; }
    public string? ExternalIdentifier { get; set; }
}