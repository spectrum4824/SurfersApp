using System.Net.Http.Headers;
using System.Text;
using practise_backend.Data;
using practise_backend.Models;

namespace practise_backend.Authorization;

/// <summary>
/// Примитивная Basic-авторизация. Извлекает логин и пароль из заголовка Authorization,
/// ищет пользователя в базе и сохраняет его ID в контекст запроса.
/// </summary>
public class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;

    /// <summary>
    /// Конструктор middleware
    /// </summary>
    public BasicAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// Основной метод middleware. Вызывается при каждом запросе.
    /// </summary>
    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            var authHeader = AuthenticationHeaderValue.Parse(context.Request.Headers["Authorization"]);
            if (authHeader.Parameter != null)
            {
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var decoded = System.Net.WebUtility.UrlDecode(Encoding.UTF8.GetString(credentialBytes));
                var credentials = decoded.Split(':', 2);
                var username = credentials[0];
                var password = credentials[1];

                User? user;
                using (ApplicationContext db = new ApplicationContext())
                {
                    // Ищем пользователя по никнейму и паролю
                    user = db.Users.FirstOrDefault(u => u.Nickname == username && u.Password == password);
                }
                context.Items["UserId"] = user?.Id;
            }
        }
        await _next(context);
    }
}