using Inovatec.OfficeManagementTool.Common;
using Inovatec.OfficeManagementTool.Models;
using Inovatec.OfficeManagementTool.Models.ViewModels.User;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Inovatec.OfficeManagementTool.ImplementationsBL.Helpers
{
    public class AuthService
    {
        public static string GetJWT(UserViewModel user)
        {
            var key = Encoding.UTF8.GetBytes(ConfigProvider.JwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim(JwtRegisteredClaimNames.Iss, ConfigProvider.Issuer),
                    new Claim(JwtRegisteredClaimNames.Aud, ConfigProvider.Audience),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UnixEpoch.ToUnixTimeSeconds().ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(ConfigProvider.TokenLifetimeHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)

            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
