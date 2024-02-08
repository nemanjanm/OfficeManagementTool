namespace Inovatec.OfficeManagementTool.Models.ViewModels
{
    public class SearchRequest
    {
        private string _searchTerm = string.Empty;
        private string _sortField = string.Empty;
        private string _sortOrder = string.Empty;

        public string SearchTerm {
            get { return _searchTerm; }

            set 
            {
                if (value != null)
                {
                    _searchTerm = value.Trim().ToLower();
                }
                else
                {
                    _searchTerm = string.Empty;
                }
            }
        }

        public string SortField { 
            get { return _sortField; }

            set
            {
                if (value != null)
                {
                    _sortField = value.Trim().ToLower();
                }
                else
                {
                    _searchTerm = string.Empty;
                }
            }
        }

        public string SortOrder
        {
            get { return _sortOrder; }

            set
            {
                if (value != null)
                {
                    _sortOrder = value.Trim().ToLower();
                }
                else
                {
                    _sortOrder = string.Empty;
                }
            }
        }
    }
}
