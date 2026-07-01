using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practise_backend.Data;

namespace practise_backend.Controllers;

/// <summary>
/// Контроллер для входа в систему
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly ApplicationContext _context;

    public LoginController(ApplicationContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Проверяет наличие пользователя в БД по логину (email или никнейм) и паролю
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // Сначала проверяем существует ли пользователь
        var userExists = await _context.Users
            .AnyAsync(u => u.Mail == loginDto.Login || u.Nickname == loginDto.Login);
    
        if (!userExists)
            return NotFound(new { message = "Такого аккаунта не существует" });

        // Потом проверяем пароль
        var user = await _context.Users
            .FirstOrDefaultAsync(u => (u.Mail == loginDto.Login || u.Nickname == loginDto.Login) 
                                   && u.Password == loginDto.Password);

        if (user == null)
            return Unauthorized(new { message = "Пароль неверный" });

        return Ok(new { userId = user.Id, nickname = user.Nickname, photo = user.Photo });
    }
}

/// <summary>
/// DTO для запроса входа в систему
/// </summary>
public class LoginDto
{
    /// <summary>Email или никнейм пользователя</summary>
    public string Login { get; set; } = string.Empty;
    
    /// <summary>Пароль пользователя</summary>
    public string Password { get; set; } = string.Empty;
}