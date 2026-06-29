using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practise_backend.Data;
using practise_backend.Models;

namespace practise_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly ApplicationContext _context;

    public PostsController(ApplicationContext context)
    {
        _context = context;
    }

    // GET: api/posts — получить все посты
    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.Date)
            .Select(p => new
            {
                p.Id,
                Author = p.User.Nickname,
                Avatar = p.User.Photo,
                p.Date,
                p.Text,
                p.Image,
                p.Likes
            })
            .ToListAsync();

        return Ok(posts);
    }

    // POST: api/posts — добавить пост
    [HttpPost]
    public async Task<IActionResult> AddPost([FromBody] PostDto postDto)
    {
        var post = new Post
        {
            UserID = 1, // пока захардкожено, потом из авторизации
            Date = DateTime.Now,
            Text = postDto.Text,
            Image = postDto.Image,
            Likes = 0
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.Date)
            .Select(p => new
            {
                p.Id,
                Author = p.User.Nickname,
                Avatar = p.User.Photo,
                p.Date,
                p.Text,
                p.Image,
                p.Likes
            })
            .ToListAsync();

        return Ok(posts);
    }
}

public class PostDto
{
    public string Text { get; set; } = string.Empty;
    public string? Image { get; set; }
}