using System.Text;
using MEWSIntegrationApp.Models;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace MEWSIntegrationApp.Services;

public class MewsApiService
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _clientToken;
    private readonly string _accessToken;
    
    public MewsApiService(HttpClient httpClient, IConfiguration configuration, bool isProduction)
    {
        _httpClient = httpClient;
        if (!isProduction)
        {
            _clientToken = configuration["MewsSettings:Demo:ClientToken"]!;
            _accessToken = configuration["MewsSettings:Demo:AccessToken"]!;
            _baseUrl = configuration["MewsSettings:Demo:BaseUrl"]!;
        }
        else
        {
            _clientToken = configuration["MewsSettings:Production:ClientToken"]!;
            _accessToken = configuration["MewsSettings:Production:AccessToken"]!;
            _baseUrl = configuration["MewsSettings:Production:BaseUrl"]!;
        }
    }

    public async Task<MewsReservationResponse?> GetReservationsAsync(WebhookEventPayload webhookPayload)
    {
        var request = new MewsReservationRequest
        {
            ClientToken = _clientToken,
            AccessToken = _accessToken,
            Client = "MEWSIntegrationApp",
            ReservationIds = webhookPayload
                .Events
                .Where(e => e.Discriminator == Discriminator.ServiceOrderUpdated)
                .Select(e => e.Value.Id)
                .ToArray(),
            Limitation = new Limitation(1)
        };
        
        if (string.IsNullOrEmpty(request.ClientToken) || string.IsNullOrEmpty(request.AccessToken))
        {
            throw new ArgumentException("ClientToken and AccessToken are required.");
        }

        var requestJson = JsonSerializer.Serialize(request);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        string ApiUrl = $"{_baseUrl}/api/connector/v1/reservations/getAll/2023-06-06";

        HttpResponseMessage response = await _httpClient.PostAsync(ApiUrl, content);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get reservations. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var reservationResponse = JsonConvert.DeserializeObject<MewsReservationResponse>(jsonResponse);

        return reservationResponse;
    }

    public async Task<MewsCustomerResponse> GetCustomerDataAsync(string accountId)
    {
        var request = new MewsCustomerRequest
        {
            ClientToken = _clientToken,
            AccessToken = _accessToken,
            Client = "MEWSIntegrationApp",
            CustomerIds = [accountId],
            Limitation = new Limitation(1)
        };

        if (string.IsNullOrEmpty(request.ClientToken) || string.IsNullOrEmpty(request.AccessToken))
        {
            throw new ArgumentException("ClientToken and AccessToken are required.");
        }

        var requestJson = JsonSerializer.Serialize(request);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        string ApiUrl = $"{_baseUrl}/api/connector/v1/customers/getAll";

        Console.WriteLine("---- HTTP REQUEST ----");
        Console.WriteLine($"URL: {ApiUrl}");
        Console.WriteLine($"Method: POST");
        Console.WriteLine("Headers:");
        foreach (var header in _httpClient.DefaultRequestHeaders)
        {
            Console.WriteLine($"  {header.Key}: {string.Join(", ", header.Value)}");
        }
        Console.WriteLine("Body:");
        Console.WriteLine(requestJson);
        Console.WriteLine("----------------------");

        HttpResponseMessage response = await _httpClient.PostAsync(ApiUrl, content);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get customer data. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var customerResponse = JsonConvert.DeserializeObject<MewsCustomerResponse>(jsonResponse);

        return customerResponse;
    }
}