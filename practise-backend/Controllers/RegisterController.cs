using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practise_backend.Data;
using practise_backend.Models;
using practise_backend.Helpers;

namespace practise_backend.Controllers;

/// <summary>
/// Контроллер для регистрации нового пользователя
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly ApplicationContext _context;

    public RegisterController(ApplicationContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Регистрирует нового пользователя, проверяет что email и никнейм не заняты
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterDto registerDto)
    {
        // Проверка дубликатов
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Mail == registerDto.Email || u.Nickname == registerDto.Nickname);

        if (existingUser != null)
            return Conflict(new { message = "Пользователь с таким email или никнеймом уже существует" });

        // Сохраняем аватар если загружен
        string? avatarFileName = null;
        if (registerDto.AvatarFile != null)
        {
            avatarFileName = ImageSaveHelper.SaveImage(registerDto.AvatarFile);
        }

        // Создание нового пользователя
        var user = new User
        {
            Nickname = registerDto.Nickname,
            Mail = registerDto.Email,
            Password = registerDto.Password,
            Name = registerDto.FirstName,
            Surname = registerDto.LastName,
            ContactInfo = registerDto.Contact,
            AboutMe = registerDto.About,
            Achievements = registerDto.Achievements,
            Photo = avatarFileName
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { userId = user.Id, nickname = user.Nickname, photo = user.Photo });
    }
}

/// <summary>
/// DTO для запроса регистрации
/// </summary>
public class RegisterDto
{
    /// <summary>Никнейм пользователя</summary>
    public string Nickname { get; set; } = string.Empty;
    
    /// <summary>Email пользователя</summary>
    public string Email { get; set; } = string.Empty;
    
    /// <summary>Пароль пользователя</summary>
    public string Password { get; set; } = string.Empty;
    
    /// <summary>Имя (необязательно)</summary>
    public string? FirstName { get; set; }
    
    /// <summary>Фамилия (необязательно)</summary>
    public string? LastName { get; set; }
    
    /// <summary>Контактная информация (необязательно)</summary>
    public string? Contact { get; set; }
    
    /// <summary>О себе (необязательно)</summary>
    public string? About { get; set; }
    
    /// <summary>Достижения (необязательно)</summary>
    public string? Achievements { get; set; }
    
    /// <summary>Файл аватара (необязательно)</summary>
    public IFormFile? AvatarFile { get; set; }
}