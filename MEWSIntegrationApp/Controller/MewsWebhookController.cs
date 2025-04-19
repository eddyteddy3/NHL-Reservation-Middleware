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
        
        Console.WriteLine("Received MEWS webhook: ", payload.ToString());
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
        var reservationId = reservationApiResponse?.Reservations.First().Id ?? "NULL reservation ID";
        var rateId = reservationApiResponse.Reservations.First().RateId ?? "NULL rate ID";
        
        var customerApiResponse = await _mewsApiService.GetCustomerDataAsync(accountId);
        var reservationGetAllItemApiResponse = await _mewsApiService.GetReservationAllItems(reservationId);
        var getAllRateApiResponse = await _mewsApiService.GetRateDataAsync(rateId);

        Console.WriteLine($"get all items response: {getAllRateApiResponse}");
        
        var firstReservationDetail = reservationGetAllItemApiResponse?.Reservations.First();
        
        if (firstReservationDetail == null)
        {
            return BadRequest(new { message = "invalid reservation detail (or no details?)" });
        }

        double totalAmount = 0;
        List<string> products = new List<string>();
        int personCount = 0;

        if (reservationApiResponse?.Reservations.First().PersonCounts != null)
        {
            foreach (var person in reservationApiResponse.Reservations.First().PersonCounts)
            {
                personCount += person.Count;
            }
        }

        foreach (var item in firstReservationDetail.Items)
        {
            totalAmount += item.Amount.Value;
            products.Add(item.Name);
        }
        
        ReservationDetailsDto reservationDetailsDto = new ReservationDetailsDto
        {
            Id = reservationId,
            TotalAmount = totalAmount.ToString(),
            Products = products.ToArray(),
            NumberOfAdults = personCount
        };
        
        if (reservationApiResponse == null || customerApiResponse == null)
        {
            return BadRequest(new { message = "invalid response" });
        }

        Rate[] rates = getAllRateApiResponse?.Rates ?? new Rate[] { };

        var reservationDto = new ReservationDto(
            reservationApiResponse.Reservations,
            customerApiResponse.Customers,
            reservationDetailsDto,
            new ReservationRateDto(rates));

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

    [HttpPost("/api/create-payment-request")]
    public async Task<IActionResult> ReceivePaymentRequest([FromBody] JsonElement payload)
    {
        var paymentRequest = ExtractRequestPayload(payload);

        if (paymentRequest == null)
        {
            return BadRequest(new { message = "Nothing found in the payload" });
        }

        var createPaymentResponse = await _mewsApiService.AddPaymentRequest(paymentRequest);

        if (createPaymentResponse == null)
        {
            return BadRequest(new {
                message = "Could not create the request payment"
            });
        }

        string paymentRequestId = createPaymentResponse.PaymentRequests[0].Id;
        return Ok(new { requestId = paymentRequestId });
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
    =>  payload.Deserialize<WebhookEventPayload>();

    private PaymentRequestPayload? ExtractRequestPayload(JsonElement payload)
    => payload.Deserialize<PaymentRequestPayload>();
}