using System.Collections;
using System.Globalization;
using System.Resources;

namespace Inovatec.OfficeManagementTool.Localization
{
    public class Localizator
    {
        private static readonly string resourceFolderPath = "Inovatec.OfficeManagementTool.Localization.Resources";

        private static readonly List<string> pageFolders = new List<string>
        {
            "User",
            "Common",
            "Offices",
            "Exceptions",
            "Items",
            "Order",
            "Equipment",
            "Reports",
            "Cart"
        };

        public static object GetJsonResources(string lang)
        {
            var resourceDic = new Dictionary<string, object>();

            foreach(var folder in pageFolders) 
            {
                AddResourceToDictionary(resourceDic, lang, folder);
            }

            return resourceDic;
        }

        public static void AddResourceToDictionary(Dictionary<string, object> resourceDic, string lang, string nameOfResource)
        {
            ResourceManager rm = null;
            
            if(lang == "sr-CA")
            {
                rm = new ResourceManager($"{resourceFolderPath}.{nameOfResource}.{lang}", 
                    typeof(Localizator).Assembly);
            }
            else if(lang == "en-CA")
            {
                rm = new ResourceManager($"{resourceFolderPath}.{nameOfResource}.{lang}",
                    typeof(Localizator).Assembly);
            }

            var rs = rm.GetResourceSet(CultureInfo.CreateSpecificCulture(lang), true, true);

            var dic = rs.Cast<DictionaryEntry>().ToDictionary(i => i.Key.ToString(), i => i.Value!.ToString());

            resourceDic.Add(nameOfResource, dic);
        }
    }
}