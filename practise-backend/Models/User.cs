namespace practise_backend.Models;

public class User
{
    public int Id { get; set; }
    public string Nickname { get; set; } = string.Empty;
    public string Mail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Surname { get; set; }
    public string? Name { get; set; }
    public string? Photo { get; set; }
    public string? ContactInfo { get; set; }
    public string? AboutMe { get; set; }
    public string? Achievements { get; set; }
    public List<Post> Posts { get; set; } = new();
}