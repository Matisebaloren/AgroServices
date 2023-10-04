#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace AgroServices.Areas.Identity.Pages.Account.Manage
{
    public class ChangeEmailModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILogger<ChangeEmailModel> _logger;

        public ChangeEmailModel(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ILogger<ChangeEmailModel> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        [TempData]
        public string StatusMessage { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "New email")]
            public string NewEmail { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, Input.Password);
            if (!isPasswordValid)
            {
                ModelState.AddModelError(string.Empty, "Invalid password.");
                return Page();
            }

            var changeEmailToken = await _userManager.GenerateChangeEmailTokenAsync(user, Input.NewEmail);
            var changeEmailResult = await _userManager.ChangeEmailAsync(user, Input.NewEmail, changeEmailToken);
            if (!changeEmailResult.Succeeded)
            {
                foreach (var error in changeEmailResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return Page();
            }

            await _signInManager.RefreshSignInAsync(user);
            _logger.LogInformation("User changed their email successfully.");
            StatusMessage = "Tu email ha sido cambiado.";

            return RedirectToPage();
        }
    }
}
