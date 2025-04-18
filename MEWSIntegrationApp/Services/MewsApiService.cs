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

        string apiUrl = $"{_baseUrl}/api/connector/v1/reservations/getAll/2023-06-06";

        HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get reservations. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var reservationResponse = JsonConvert.DeserializeObject<MewsReservationResponse>(jsonResponse);

        return reservationResponse;
    }

    public async Task<MewsCustomerResponse?> GetCustomerDataAsync(string accountId)
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

        string apiUrl = $"{_baseUrl}/api/connector/v1/customers/getAll";

        HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get customer data. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var customerResponse = JsonConvert.DeserializeObject<MewsCustomerResponse>(jsonResponse);

        return customerResponse;
    }

    public async Task<ReservationAllItemsResponse?> GetReservationAllItems(string reservationId)
    {
        var request = new ReservationAllItemsRequest
        {
            ClientToken = _clientToken,
            AccessToken = _accessToken,
            Client = "MEWSIntegrationApp",
            ReservationIds = [reservationId],
            Limitation = new Limitation(1)
        };

        if (string.IsNullOrEmpty(request.ClientToken) || string.IsNullOrEmpty(request.AccessToken))
        {
            throw new ArgumentException("ClientToken and AccessToken are required.");
        }

        var requestJson = JsonSerializer.Serialize(request);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        string apiUrl = $"{_baseUrl}/api/connector/v1/reservations/getAllItems";

        HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get reservation items. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var reservationItemsResponse = JsonConvert.DeserializeObject<ReservationAllItemsResponse>(jsonResponse);

        return reservationItemsResponse;
    }

    public async Task<MewsRateResponse?> GetRateDataAsync(string rateId)
    {
        var request = new MewsRateRequest
        {
            ClientToken = _clientToken,
            AccessToken = _accessToken,
            Client = "MEWSIntegrationApp",
            RateIds = [rateId],
            Limitation = new Limitation(1)
        };

        if (string.IsNullOrEmpty(request.ClientToken) || string.IsNullOrEmpty(request.AccessToken))
        {
            throw new ArgumentException("ClientToken and AccessToken are required.");
        }

        var requestJson = JsonSerializer.Serialize(request);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        string apiUrl = $"{_baseUrl}/api/connector/v1/rates/getAll";

        HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to get rate data. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var rateResponse = JsonConvert.DeserializeObject<MewsRateResponse>(jsonResponse);

        return rateResponse;
    }

    public async Task<MewsCreatePaymentRequestResponse?> AddPaymentRequest(PaymentRequestPayload request)
    {
        // MewsPaymentRequest paymentRequest = new MewsPaymentRequest(
        //     request.AccountId,
        //     request.ReservationId,
        //     new MewsPaymentAmount(request.Amount),
        //     request.Reason,
        //     request.ExpirationDate,
        //     request.Description,
        //     null
        // );

        // var paymentRequest = new MewsPaymentRequest
        // {
        //     AccountId = request.AccountId,
        //     Amount = new MewsPaymentAmount { Value = request.Amount },
        //     Type = "Prepayment",
        //     Reason = request.Reason,
        //     ExpirationUtc = request.ExpirationDate,
        //     ReservationId = request.ReservationId,
        //     Description = request.Description
        // };

        var apiRequest = new MewsAddPaymentRequest
        {
            ClientToken = _clientToken,
            AccessToken = _accessToken,
            Client = "MEWSIntegrationApp",
            PaymentRequests = [
                new MewsPaymentRequest
                {
                    AccountId = request.AccountId,
                    Amount = new MewsPaymentAmount { Value = request.Amount },
                    Type = "Payment",
                    Reason = request.Reason,
                    ExpirationUtc = request.ExpirationDate,
                    ReservationId = request.ReservationId,
                    Description = request.Description
                }
            ]
        };

        if (string.IsNullOrEmpty(apiRequest.ClientToken) || string.IsNullOrEmpty(apiRequest.AccessToken))
        {
            throw new ArgumentException("ClientToken and AccessToken are required.");
        }

        var requestJson = JsonSerializer.Serialize(apiRequest);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        string apiUrl = $"{_baseUrl}/api/connector/v1/paymentRequests/add";

        HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Failed to create the payment request. Status code: {response.StatusCode}");
        }

        string jsonResponse = await response.Content.ReadAsStringAsync();
        var paymentRequestResponse = JsonConvert.DeserializeObject<MewsCreatePaymentRequestResponse>(jsonResponse);

        return paymentRequestResponse;
    }
}