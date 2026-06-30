namespace practise_backend.Helpers;

/// <summary>
/// Хелпер для сохранения изображений на сервер
/// </summary>
public class ImageSaveHelper
{
    /// <summary>
    /// Сохраняет изображение в папку StaticFiles/img и возвращает новое имя файла
    /// </summary>
    /// <param name="image">Загруженный файл изображения</param>
    /// <returns>Новое имя файла с расширением</returns>
    public static string SaveImage(IFormFile image)
    {
        // Путь к папке с изображениями
        string path = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "StaticFiles", "img"));

        // Создаём папку если её нет
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        // Получаем расширение файла
        string ext = Path.GetExtension(image.FileName);

        // Генерируем уникальное имя
        string newName = Guid.NewGuid().ToString() + ext;

        // Сохраняем файл
        using (var fileStream = new FileStream(Path.Combine(path, newName), FileMode.Create))
        {
            image.CopyTo(fileStream);
        }

        return newName;
    }
}