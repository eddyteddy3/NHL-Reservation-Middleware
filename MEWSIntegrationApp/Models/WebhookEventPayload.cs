using System.Text.Json.Serialization;

namespace MEWSIntegrationApp.Models;

public record WebhookEventPayload
{
    public required string EnterpriseId { get; init; }
    public required string IntegrationId { get; init; }
    public required EventPayload[] Events { get; init; } 
}

public record EventPayload
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required Discriminator Discriminator { get; init; }
    public required Value Value { get; init; }
}

public record Value(string Id);

public enum Discriminator
{
    ServiceOrderUpdated,
    ResourceUpdated,
    MessageAdded,
    ResourceBlockUpdated,
    CustomerAdded,
    CustomerUpdated,
    PaymentUpdated
}