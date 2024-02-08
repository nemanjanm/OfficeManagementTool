using Inovatec.OfficeManagementTool.InterfacesBL;
using Inovatec.OfficeManagementTool.Models.Entity;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;

namespace Inovatec.OfficeManagementTool.API.SignalR
{
    public class OrdersHub: Hub
    {
        private readonly IUserBL _userBL;
        public OrdersHub(IUserBL userBL) 
        {
            _userBL = userBL;    
        }

        public async Task JoinGroups(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);
            var userId = decodedToken.Claims.First(claim => claim.Type == "Id").Value;
            long office = (await _userBL.GetOfficeIdForUser(long.Parse(userId))).Data;
            await Groups.AddToGroupAsync(Context.ConnectionId, "orders_" + office);
            await Groups.AddToGroupAsync(Context.ConnectionId, "reports");
            await Groups.AddToGroupAsync(Context.ConnectionId, "office_" + office);
            await Groups.AddToGroupAsync(Context.ConnectionId, "user_" + userId);
        }
    }
}
