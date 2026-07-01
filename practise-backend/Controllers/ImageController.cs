using Microsoft.AspNetCore.Mvc;
using practise_backend.Helpers;

namespace practise_backend.Controllers;

/// <summary>
/// Контроллер для работы с изображениями.
/// Принимает файл, сохраняет через ImageSaveHelper, возвращает путь.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    /// <summary>
    /// Сохраняет изображение на сервер и возвращает путь к нему
    /// </summary>
    /// <param name="image">Файл изображения</param>
    /// <returns>Имя сохранённого файла</returns>
    [HttpPost]
    public IActionResult SaveImage([FromForm] IFormFile image)
    {
        if (image == null)
            return BadRequest(new { message = "Файл не загружен" });

        // Вызывает ImageSaveHelper для сохранения
        string fileName = ImageSaveHelper.SaveImage(image);

        // Возвращает имя файла (строковый путь)
        return Ok(new { path = fileName });
    }

    /// <summary>
    /// Возвращает изображение по имени файла
    /// </summary>
    /// <param name="fileName">Имя файла</param>
    /// <returns>Файл изображения</returns>
    [HttpGet("{fileName}")]
    public IActionResult GetImage(string fileName)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles", "img", fileName);

        if (!System.IO.File.Exists(path))
            return NotFound();

        var ext = Path.GetExtension(fileName).ToLower();
        var mimeType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        return PhysicalFile(path, mimeType);
    }
}