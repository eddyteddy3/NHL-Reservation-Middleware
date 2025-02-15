using MEWSIntegrationApp.Models;

namespace MEWSIntegrationApp;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("webhooks/mews")]
public class MewsWebhookController : ControllerBase
{
    private readonly ILogger<MewsWebhookController> _logger;

    public MewsWebhookController(ILogger<MewsWebhookController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ReceiveWebhook([FromBody] JsonElement payload)
    {
        _logger.LogInformation("Received MEWS webhook: {Payload}", payload.ToString());
        Console.WriteLine("Received MEWS webhook: {0}", payload.ToString());
    
        var reservation = ExtractPayload(payload);

        if (reservation == null)
        {
            return BadRequest(new { message = "invalid payload" });
        }

        return Ok(new
            {
                message = $"reservation {reservation.EnterpriseId} received",
                events = $"event {reservation.Events.First()} received"
            }
        );
    }

    private WebhookEventPayload? ExtractPayload(JsonElement payload)
    {
        return payload.Deserialize<WebhookEventPayload>();
    }
}