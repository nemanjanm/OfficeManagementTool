namespace Inovatec.OfficeManagementTool.ImplementationsBL.Helpers
{
    public class PasswordService
    {
        public static string HashPass(string pass)
        {
            return BCrypt.Net.BCrypt.HashPassword(pass);
        }

        public static bool VerifyPassword(string pass, string attempt) 
        {
            return BCrypt.Net.BCrypt.Verify(attempt, pass);
        }
    }
}
