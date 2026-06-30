using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace practise_backend.Authorization;

/// <summary>
/// Атрибут авторизации. Проверяет наличие UserId в контексте запроса.
/// Если пользователь не авторизован — возвращает 401 Unauthorized.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    /// <summary>
    /// Проверяет авторизацию перед выполнением метода контроллера
    /// </summary>
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var userId = (int?)context.HttpContext.Items["UserId"];
        if (userId == null)
        {
            context.Result = new JsonResult(new { message = "Unauthorized" }) 
            { 
                StatusCode = StatusCodes.Status401Unauthorized 
            };
        }
    }
}