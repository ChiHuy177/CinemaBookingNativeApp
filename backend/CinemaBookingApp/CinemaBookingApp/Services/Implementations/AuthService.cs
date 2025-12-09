
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Helpers.Email;
using CinemaBookingApp.Helpers.Validators;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using static CinemaBookingApp.Models.DTOs.Register;
using FluentValidation.Results;
using FluentValidation;
using AutoMapper;
using CinemaBookingApp.Repositories.Interfaces;
using static CinemaBookingApp.Models.DTOs.Login;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Helpers.Validators.Auth;
using static CinemaBookingApp.Models.DTOs.ResetPasswordCode;


namespace CinemaBookingApp.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IValidatorService _validatorService;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        private readonly IClientRepository _clientRepository;
        private readonly IPasswordResetCodeRepository _passwordResetCodeRepository;
        private readonly LinkGenerator _linkGenerator;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Random _random = new Random();

        public AuthService(UserManager<IdentityUser> userManager,
                              SignInManager<IdentityUser> signInManager,
                              ITokenService tokenService, IValidatorService validatorService, IEmailSender emailSender, 
                              IMapper mapper,IClientRepository clientRepository, LinkGenerator linkGenerator, IHttpContextAccessor httpContextAccessor, 
                              IPasswordResetCodeRepository passwordResetCodeRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _validatorService = validatorService;
            _emailSender = emailSender;
            _mapper = mapper;
            _clientRepository = clientRepository;
            _linkGenerator = linkGenerator;
            _httpContextAccessor = httpContextAccessor;
            _passwordResetCodeRepository = passwordResetCodeRepository;
        }

        public async Task<string> ConfirmEmailAsync(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
            {
                var failures = result.Errors.Select(e => new ValidationFailure("Identity", e.Description));
                throw new ValidationException(failures);
            }

            return "Email confirmed successfully. You can now log in.";
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                throw new ApiException(ErrorCode.LOGIN_FAIL);
            }

            if (!user.EmailConfirmed)
            {
                throw new ApiException(ErrorCode.USER_NOT_ACTIVE);
            }

            var roles = await _userManager.GetRolesAsync(user);

            var client = await _clientRepository.GetByEmailAsync(dto.Email);

            if (client == null) { 
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            

            var token = _tokenService.GenerateToken(client, roles);

            return new LoginResponseDTO
            {
                Email = dto.Email,
                Authenticated = true,
                Token = token
            };
        }

        public async Task<string> RegisterAsync(RegisterRequestDTO dto, string requestScheme)
        {
            var checkUser = await _userManager.FindByEmailAsync(dto.Email);

            if (checkUser != null)
            {
                throw new ApiException(ErrorCode.EMAIL_EXISTED);
            }

            await _validatorService.ValidateAsync(dto);


            var user = new IdentityUser
            {
                Email = dto.Email,
                UserName = dto.Email,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var failures = result.Errors.Select(e => new ValidationFailure("Identity", e.Description));
                throw new ValidationException(failures);
            }

            await _userManager.AddToRoleAsync(user, "CLIENT");

            var client = _mapper.Map<Client>(dto);

            await _clientRepository.AddAsync(client);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var confirmUrl = _linkGenerator.GetUriByAction(
            _httpContextAccessor.HttpContext!,
            action: "ConfirmEmail",
            controller: "Auth",
            values: new { userId = user.Id, token = encodedToken },
            scheme: requestScheme);

            var emailHtml =
                                  $@"<h3>Welcome to CinemaBookingApp!</h3>
                                <p>Click the link below to verify your account:</p>
                                <a href='{confirmUrl}'>Verify Email</a>";



            await _emailSender.SendEmailAsync(user.Email, "Verify Your Account", emailHtml);
            return "Register successfully, please check email to activate the account!";
        }


        public async Task<string> SendResetPasswordCodeAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var prc = await _passwordResetCodeRepository.GetByEmailAsync(email);

            if(prc != null)
            {
                await _passwordResetCodeRepository.DeleteAsync(prc);
            }



            var code = getRandomCode();
            var expiredAt = DateTime.UtcNow.AddMinutes(5);

            var resetCode = new PasswordResetCode
            {
                Email = email,
                Code = code,
                ExpiredAt = expiredAt,
            };

            await _passwordResetCodeRepository.AddAsync(resetCode);
             var subject = "Reset your password - CinemaBookingApp";
            var htmlMessage = $@"
                                    <p>Hello,</p>
                                    <p>You requested a password reset.</p>
                                    <p>Your verification code is:</p>
                                    <h2>{code}</h2>
                                    <p>Please enter this code to reset your password.</p>
                                    <p>This code will expire in 5 minutes.</p>
                                    <p>If you didn’t request this, you can ignore this email.</p>
                                    <p>Thank you!</p>";

            await _emailSender.SendEmailAsync(email, subject, htmlMessage);

            return "Send Code Successfully!";
        }

        public async Task<string> ResendResetPasswordCodeAsync(string email)
        {
            return  await SendResetPasswordCodeAsync(email);
        }

        public async Task<string> ResetPasswordByCodeAsync(ResetPasswordCodeRequestDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var code = await _passwordResetCodeRepository.GetByCodeAndEmailAsync(dto.Code,dto.Email);
            if(code == null)
            {
                throw new ApiException(ErrorCode.VERIFICATION_CODE_NOT_FOUND);
            }

            if (code.ExpiredAt < DateTime.UtcNow) {
                throw new ApiException(ErrorCode.CODE_EXPIRED);
            }

            var removeResult = await _userManager.RemovePasswordAsync(user);
            if (!removeResult.Succeeded) {
                throw new ApiException(ErrorCode.SERVER_ERROR);
            }

            var addResult = await _userManager.AddPasswordAsync(user, dto.NewPassword);
            if (!addResult.Succeeded)
            {
                throw new ApiException(ErrorCode.SERVER_ERROR);
            }
            await _passwordResetCodeRepository.DeleteAsync(code);

            return "Change Password Successfully!!";

        }


        private string getRandomCode()
        {
            return _random.Next(100000, 999999).ToString();
        }
    }
}
