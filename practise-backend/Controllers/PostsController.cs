using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practise_backend.Data;
using practise_backend.Models;
using practise_backend.Helpers;
using practise_backend.Authorization;

namespace practise_backend.Controllers;

/// <summary>
/// Контроллер для работы с постами
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly ApplicationContext _context;

    public PostsController(ApplicationContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Возвращает все посты, отсортированные по дате (новые сверху)
    /// </summary>
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

    /// <summary>
    /// Добавляет новый пост и возвращает обновлённый список всех постов
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddPost([FromForm] PostDto postDto)
    {
        string? imageFileName = null;

        if (postDto.ImageFile != null)
        {
            imageFileName = ImageSaveHelper.SaveImage(postDto.ImageFile);
        }

        var post = new Post
        {
            UserID = 4,
            Date = DateTime.Now,
            Text = postDto.Text,
            Image = imageFileName,
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

/// <summary>
/// DTO для добавления поста
/// </summary>
public class PostDto
{
    /// <summary>Текст поста</summary>
    public string Text { get; set; } = string.Empty;
    
    /// <summary>Файл изображения (необязательно)</summary>
    public IFormFile? ImageFile { get; set; }
}