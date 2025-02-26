using System.Security.Cryptography.X509Certificates;

namespace MEWSIntegrationApp.Models;

public record MewsReservationResponse
{
    public Reservation[] Reservations { get; set; }
    public string Cursor { get; set; }
}

public record Reservation
{
    public string Id { get; set; }
    public string ServiceId { get; set; }
    public string AccountId { get; set; } // required for customer/company lookup
    public string AccountType { get; set; }
    public string CreatorProfileId { get; set; }
    public string UpdaterProfileId { get; set; }
    public string BookerId { get; set; } // required
    public string Number { get; set; }
    public string State { get; set; }
    public string Origin { get; set; }
    public DateTime? CreatedUtc { get; set; }
    public DateTime? UpdatedUtc { get; set; }
    public DateTime? CancelledUtc { get; set; }
    public Options Options { get; set; }
    public string RateId { get; set; }
    public string GroupId { get; set; }
    public string RequestedResourceCategoryId { get; set; }
    public string AssignedResourceId { get; set; }
    public bool AssignedResourceLocked { get; set; }
    public string ChannelNumber { get; set; }
    public string ChannelManagerNumber { get; set; }
    public DateTime? StartUtc { get; set; }
    public DateTime? EndUtc { get; set; }
    public string Purpose { get; set; }
    public List<PersonCount> PersonCounts { get; set; }
}

public record Options
{
    public bool OwnerCheckedIn { get; set; }
    public bool AllCompanionsCheckedIn { get; set; }
    public bool AnyCompanionCheckedIn { get; set; }
    public bool ConnectorCheckIn { get; set; }
}

public record PersonCount
{
    public string AgeCategoryId { get; set; }
    public int Count { get; set; }
}

// ---------------------------------------------------


public record ReservationAllItemsRequest
{
    public string ClientToken { get; set; }
    public string AccessToken { get; set; }
    public string Client { get; set; }
    public string[] ReservationIds { get; set; }
    public Limitation Limitation { get; set; }
}

public record ReservationAllItemsResponse
{
    public ReservationItem[] Reservations { get; set; }
}

public record ReservationItem
{
    public string ReservationId { get; set; }
    public List<ReservationDetailItem> Items { get; set; }
}

public record ReservationDetailItem
{
    public string Id { get; set; }
    public string AccountId { get; set; }
    public string CustomerId { get; set; }
    public string OrderId { get; set; }
    public string ServiceId { get; set; }
    public string Type { get; set; }
    public string SubType { get; set; }
    public string Name { get; set; }
    public string? Notes { get; set; }
    public ReservationDetailItemAmount Amount { get; set; }

}

public record ReservationDetailItemAmount
{
    public double Value { get; set; }
    public double Net { get; set; }
    public double Tax { get; set; }
    public double NetValue { get; set; }
    public double GrossValue { get; set; }
    public List<ReservationDetailItemTaxValue> TaxValues { get; set; }
    public ReservationDetailItemBreakdown Breakdown { get; set; }
}

public record ReservationDetailItemTaxValue
{
    public string Code { get; set; }
    public double Value { get; set; }
}

public record ReservationDetailItemBreakdown
{
    public List<ReservationDetailItemBreakdownItem> Items { get; set; }
}

public record ReservationDetailItemBreakdownItem
{
    public string TaxRateCode { get; set; }
    public double Amount { get; set; }
    public double TaxValue { get; set; }
}