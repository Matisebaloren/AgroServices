using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

public class RefreshRolesFilter : IAsyncActionFilter
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public RefreshRolesFilter(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Obtener el usuario actual
        var user = await _userManager.GetUserAsync(context.HttpContext.User);

        // Actualizar la cookie de autenticación
        if (user != null)
        {
            await _signInManager.RefreshSignInAsync(user);
        }

        // Continuar con la ejecución de la acción
        await next();
    }
}
