using System.Text.Json;
using MEWSIntegrationApp.Models;
using MEWSIntegrationApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MEWSIntegrationApp.Controller;

[ApiController]
[Route("webhooks/mews")]
public class MewsWebhookController(
    ILogger<MewsWebhookController> logger,
    MewsApiService mewsApiService)
    : ControllerBase
{
    private readonly MewsApiService _mewsApiService = mewsApiService;

    [HttpPost]
    public async Task<IActionResult> ReceiveWebhook([FromBody] JsonElement payload)
    {
        logger.LogInformation("Received MEWS webhook");
        // Console.WriteLine("Received MEWS webhook: {0}", payload.ToString());
    
        var reservation = ExtractPayload(payload);

        if (reservation == null)
        {
            return BadRequest(new { message = "invalid payload" });
        }

        var reservationApiResponse = await _mewsApiService.GetReservationsAsync(reservation);
            
        
        logger.LogInformation($"API Response after fetching the reservation: {reservationApiResponse?.Reservations.First().AccountId ?? "NULL ACCOUNT ID"}");

        var accountId = reservationApiResponse?.Reservations.First().AccountId ?? "NULL ACCOUNT ID";
        var customerApiResponse = await _mewsApiService.GetCustomerDataAsync(accountId);
        
        logger.LogInformation($"API Response after fetching the customer: {customerApiResponse.Customers.First().LastName}");
        
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