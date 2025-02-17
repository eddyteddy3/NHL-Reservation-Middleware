using System.Text.Json.Serialization;

namespace MEWSIntegrationApp.Models;

public record MewsCustomerResponse
{
    public Customer[] Customers { get; set; }
    public string Cursor { get; set; }
}

public record Customer
{
    public string Id { get; set; }
    public string ChainId { get; set; }
    public string Number { get; set; }
    public string Title { get; set; }
    public string Sex { get; set; }
    public string Gender { get; set; }
    public string? FirstName { get; set; }
    public string LastName { get; set; }
    public string? SecondLastName { get; set; }
    public string? NationalityCode { get; set; }
    public string PreferredLanguageCode { get; set; }
    public string LanguageCode { get; set; }
    public string? BirthDate { get; set; }
    public string? BirthPlace { get; set; }
    public string? Occupation { get; set; }
    public string Email { get; set; }
    public bool HasOtaEmail { get; set; }
    public string? Phone { get; set; }
    public string? TaxIdentificationNumber { get; set; }
    public string? LoyaltyCode { get; set; }
    public string? AccountingCode { get; set; }
    public string? BillingCode { get; set; }
    public string? Notes { get; set; }
    public string? CarRegistrationNumber { get; set; }
    public string? DietaryRequirements { get; set; }
    public DateTime CreatedUtc { get; set; }
    public DateTime UpdatedUtc { get; set; }
    public string? Passport { get; set; }
    public string? IdentityCard { get; set; }
    public string? Visa { get; set; }
    public string? DriversLicense { get; set; }
    public string? Address { get; set; }
    public string? AddressId { get; set; }
    public string[] Classifications { get; set; }
    // [JsonConverter(typeof(JsonStringEnumConverter))]
    public string[] Options { get; set; }
    public string? CategoryId { get; set; }
    public string? BirthDateUtc { get; set; }
    public string? ItalianDestinationCode { get; set; }
    public string? ItalianFiscalCode { get; set; }
    public string? CompanyId { get; set; }
    public string? MergeTargetId { get; set; }
    public string ActivityState { get; set; }
    public bool IsActive { get; set; }
    public string? IsUpdatedByMe { get; set; }
    public string[] PreferredSpaceFeatures { get; set; }
}

public enum Option
{
    Invoiceable
}