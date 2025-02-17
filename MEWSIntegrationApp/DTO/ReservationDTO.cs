using MEWSIntegrationApp.Models;

namespace MEWSIntegrationApp.DTO;

public record ReservationDto(Reservation[] Reservation, Customer[] Customer);