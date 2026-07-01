namespace practise_backend.Models;

public class Post
{

    public int Id { get; set; }
    public int UserID { get; set; }
    public User User { get; set; } = null!;
    public DateTime Date { get; set; }
    public string? Text { get; set; }
    public string? Image { get; set; }
    public int Likes { get; set; }
}