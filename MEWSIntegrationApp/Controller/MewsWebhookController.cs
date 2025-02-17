using System.Collections.Concurrent;
using System.Text.Json;
using MEWSIntegrationApp.DTO;
using MEWSIntegrationApp.Models;
using MEWSIntegrationApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MEWSIntegrationApp.Controller;

[ApiController]
// [Route("webhooks/mews")]
[Route("api/mews")]
public class MewsWebhookController(
    ILogger<MewsWebhookController> logger,
    MewsApiService mewsApiService)
    : ControllerBase
{
    private readonly MewsApiService _mewsApiService = mewsApiService;
    private static readonly ConcurrentDictionary<Guid, StreamWriter> _clients = new();


    [HttpPost("webhook")]
    public async Task<IActionResult> ReceiveWebhook([FromBody] JsonElement payload)
    {
        logger.LogInformation("Received MEWS webhook");
        // Console.WriteLine("Received MEWS webhook: {0}", payload.ToString());
    
        var reservation = ExtractPayload(payload);

        if (reservation == null)
        {
            return BadRequest(new { message = "invalid payload" });
        }

        // logger.LogInformation($"API Response after fetching the reservation: {reservationApiResponse?.Reservations.First().AccountId ?? "NULL ACCOUNT ID"}");
        // logger.LogInformation($"API Response after fetching the customer: {customerApiResponse.Customers.First().LastName}");

        var reservationApiResponse = await _mewsApiService.GetReservationsAsync(reservation);
        var accountId = reservationApiResponse?.Reservations.First().AccountId ?? "NULL ACCOUNT ID";
        var customerApiResponse = await _mewsApiService.GetCustomerDataAsync(accountId);
        
        if (reservationApiResponse == null || customerApiResponse == null)
        {
            return BadRequest(new { message = "invalid response" });
        }

        var reservationDto = new ReservationDto(reservationApiResponse.Reservations, customerApiResponse.Customers);

        var reservationDtoReservation = JsonSerializer.Serialize(reservationDto);

        foreach (var client in _clients.Values)
        {
            try
            {
                await client.WriteLineAsync($"data: {reservationDtoReservation}\n");
                await client.FlushAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SSE Error] {ex.Message}");
            }
        }

        return Ok(new
            {
                message = $"reservation {reservation.EnterpriseId} received",
                events = $"event {reservation.Events.First()} received"
            }
        );
    }

    [HttpGet("subscriptions/reservations")]
    public async Task Subscribe()
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        // Response.Headers.Append("Connection", "keep-alive");
        Response.Headers.Append("X-Accel-Buffering", "no");

        var clientId = Guid.NewGuid();
        using var streamWriter = new StreamWriter(Response.Body, leaveOpen: true);
        _clients.TryAdd(clientId, streamWriter);
        
        try 
        {
            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                await Task.Delay(1000);
            }
        }
        finally
        {
            _clients.TryRemove(clientId, out _);
        }
    }

    private WebhookEventPayload? ExtractPayload(JsonElement payload)
    {
        return payload.Deserialize<WebhookEventPayload>();
    }
}