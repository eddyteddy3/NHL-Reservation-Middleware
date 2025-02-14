namespace MEWSIntegrationApp;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("webhooks/mews")] // ✅ This should match your curl request
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
        return Ok(new { message = "Webhook received successfully" });
    }
}
