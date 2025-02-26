using MEWSIntegrationApp.Models;

namespace MEWSIntegrationApp.DTO;

public record ReservationDto(Reservation[] Reservation, Customer[] Customer, ReservationDetailsDto ReservationDetails);

public class ReservationDetailsDto
{
    // public ReservationDetailsDto(string id, string totalAmount, string[] products, int numberOfAdults)
    // {
    //     Id = id;
    //     TotalAmount = totalAmount;
    //     Products = products;
    //     NumberOfAdults = numberOfAdults;
    // }
    //
    // public ReservationDetailsDto()
    // {
    //     throw new NotImplementedException();
    // }

    public string Id { get; set; }
    public string TotalAmount { get; set; }
    public string[] Products { get; set; }
    public int NumberOfAdults { get; set; }
}