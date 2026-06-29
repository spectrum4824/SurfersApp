using Microsoft.EntityFrameworkCore;
using practise_backend.Models;

namespace practise_backend.Data;

public class ApplicationContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public ApplicationContext()
    {
        //Database.EnsureDeleted();
        var databaseCreated = Database.EnsureCreated();
        if (databaseCreated)
        {
            User user1 = new User { Nickname = "andrew", Name = "Андрей", Photo = "andrew.png", Mail = "andrew@surf.ru", Password = "*" };
            User user2 = new User { Nickname = "maria", Name = "Мария", Photo = "maria.jpg", Mail = "maria@surf.ru", Password = "*" };
            User user3 = new User { Nickname = "nikita", Name = "Никита", Photo = "nikita.png", Mail = "nikita@surf.ru", Password = "*" };

            Post post1 = new Post { Text = "Хорошо провели время", User = user1, Date = new DateTime(2023, 05, 05, 14, 25, 0), Image = "1.jpg", Likes = 0 };
            Post post2 = new Post { Text = "Покатались на досках", User = user2, Date = new DateTime(2023, 05, 23, 17, 11, 0), Image = "2.jpg", Likes = 0 };
            Post post3 = new Post { Text = "Еще раз поедем", User = user3, Date = new DateTime(2023, 05, 30, 20, 33, 0), Image = "3.jpg", Likes = 0 };

            Users.AddRange(user1, user2, user3);
            Posts.AddRange(post1, post2, post3);
            SaveChanges();
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=summer practice db;Username=postgres;Password=password");
    }
}