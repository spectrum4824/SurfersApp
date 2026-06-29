using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practise_backend.Data;
using practise_backend.Models;

namespace practise_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationContext _context;

    public AuthController(ApplicationContext context)
    {
        _context = context;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => (u.Mail == loginDto.Login || u.Nickname == loginDto.Login) 
                                       && u.Password == loginDto.Password);

        if (user == null)
            return Unauthorized(new { message = "Неверный логин или пароль" });

        return Ok(new { userId = user.Id, nickname = user.Nickname });
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Mail == registerDto.Email || u.Nickname == registerDto.Nickname);

        if (existingUser != null)
            return Conflict(new { message = "Пользователь уже существует" });

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
            Photo = registerDto.Avatar
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { userId = user.Id, nickname = user.Nickname });
    }
}

public class LoginDto
{
    public string Login { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string Nickname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Contact { get; set; }
    public string? About { get; set; }
    public string? Achievements { get; set; }
    public string? Avatar { get; set; }
}