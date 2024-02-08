using Microsoft.EntityFrameworkCore;
using Inovatec.OfficeManagementTool.InterfacesDAL;
using System.Reflection;
using System.Linq.Expressions;
using Inovatec.OfficeManagementTool.ImplementationsDAL.Context;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL
{
    public class BaseDAL<T> : IBaseDAL<T> where T : class
    {
        protected OfficeManagementTool_IS2023_team2Context _context;
        protected DbSet<T> table;

        public BaseDAL(OfficeManagementTool_IS2023_team2Context context)
        {
            _context = context;
            table = _context.Set<T>();
        }

        public async Task Delete(long id)
        {
            T? item = await GetById(id);
            
            if(item != null)
            {
                Type itemType = typeof(T);
                PropertyInfo? isDeletedProperty = itemType.GetProperty("IsDeleted");
                
                if(isDeletedProperty != null) 
                {
                    isDeletedProperty.SetValue(item, true);
                }
                
                table.Update(item);
            }
        }

        public async Task<List<T>> GetAll()
        {
            return await table.ToListAsync();
        }

        public async Task<List<T>> GetAllByFilter(Expression<Func<T, bool>> filter)
        {
            return await table.Where(filter).ToListAsync();
        }

        public async Task<T?> GetById(long id)
        {
            return await table.FindAsync(id);
        }

        public async Task Insert(T item)
        {
            await table.AddAsync(item);
        }

        public async Task SaveChangesAsync(long? id = -1)
        {
            _context.ChangeTracker.DetectChanges();

            foreach (var entry in _context.ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        if(id != -1 && entry.Property("LastModifiedBy") != null)
                        {
                            entry.Property("LastModifiedBy").CurrentValue = id!;
                        }

                        if (entry.Property("DateModified") != null)
                        {
                            entry.Property("DateModified").CurrentValue = DateTime.Now;
                        }
                        break;

                    case EntityState.Added:
                        if (entry.Property("DateCreated") != null)
                        {
                            entry.Property("DateCreated").CurrentValue = DateTime.Now;
                        }

                        if (entry.Property("DateModified") != null)
                        {
                            entry.Property("DateModified").CurrentValue = DateTime.Now;
                        }
                        break;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task Update(T item)
        {
            table.Update(item);
        }
    }
}