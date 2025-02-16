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
    public string AccountId { get; set; }
    public string AccountType { get; set; }
    public string CreatorProfileId { get; set; }
    public string UpdaterProfileId { get; set; }
    public string BookerId { get; set; }
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