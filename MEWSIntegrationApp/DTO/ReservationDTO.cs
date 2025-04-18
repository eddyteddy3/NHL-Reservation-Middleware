using MEWSIntegrationApp.Models;

namespace MEWSIntegrationApp.DTO;

public record ReservationDto(
    Reservation[] Reservation,
    Customer[] Customer,
    ReservationDetailsDto ReservationDetails,
    ReservationRateDto ReservationRate);

public class ReservationDetailsDto
{
    public string Id { get; set; }
    public string TotalAmount { get; set; }
    public string[] Products { get; set; }
    public int NumberOfAdults { get; set; }
}

public record ReservationRateDto(Rate[] Rates);