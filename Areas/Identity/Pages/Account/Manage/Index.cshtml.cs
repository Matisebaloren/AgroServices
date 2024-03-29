// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using AgroServices.Data;
using AgroServices.Models;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AgroServices.Areas.Identity.Pages.Account.Manage
{
    public class IndexModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private AgroServicesDbContext _contexto;

        public IndexModel(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            AgroServicesDbContext contexto)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contexto = contexto;
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string StatusMessage { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [BindProperty]
        public InputModel Input { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public class InputModel
        {
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Phone]
            [Display(Name = "Telefono")]
            public string PhoneNumber { get; set; }

            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

            [Display(Name = "Apellido")]
            public string Apellido { get; set; }

            [Required(ErrorMessage = "Por favor, Selecciona una ciudad")]
            [Display(Name = "Localidad")]
            [Compare("LocalidadID", ErrorMessage = "Localidad sin especificar.")]
            public int LocalidadID { get; set; }


            [NotMapped]
            public int ProvinciaIDGet { get; set; }
            [NotMapped]
            public int LocalidadIDGet { get; set; }
        }

        private async Task LoadAsync(IdentityUser user)
        {
            var userName = await _userManager.GetUserNameAsync(user);
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);

            Username = userName;

            Input = new InputModel
            {
                PhoneNumber = phoneNumber
            };
        }

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var usuario = _contexto.Usuarios.Include(u => u.Localidades).Where(u => u.ASP_UserID == user.Id).FirstOrDefault();
            // Nombre = usuario.Nombre;
            // Apellido = usuario.Apellido;

            await LoadAsync(user);

            Input.Apellido = usuario.Apellido;
            Input.Nombre = usuario.Nombre;
            Input.LocalidadID = usuario.LocalidadID;
            Input.LocalidadIDGet = usuario.LocalidadID;
            Input.ProvinciaIDGet = usuario.Localidades.ProvinciaID;

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }
            var usuario = _contexto.Usuarios.Where(u => u.ASP_UserID == user.Id).FirstOrDefault();
            if (usuario != null)
            {

                usuario.Apellido = Input.Apellido;

                usuario.Nombre = Input.Nombre;

                usuario.LocalidadID = Input.LocalidadID;

                _contexto.SaveChanges();
            }


            if (!ModelState.IsValid)
            {
                await LoadAsync(user);
                return Page();
            }

            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            // var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            // var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (Input.PhoneNumber != phoneNumber)
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    StatusMessage = "Unexpected error when trying to set phone number.";
                    return RedirectToPage();
                }
            }

            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Perfil Actualizado";
            return RedirectToPage();
        }
    }
}
