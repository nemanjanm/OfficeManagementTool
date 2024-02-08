﻿using System.Linq.Expressions;

namespace Inovatec.OfficeManagementTool.InterfacesDAL
{
    public interface IBaseDAL<T> where T : class
    {

        public Task<List<T>> GetAll();

        public Task<List<T>> GetAllByFilter(Expression<Func<T, bool>> filter);

        public Task<T?> GetById(long id);

        public Task Insert(T item);

        public Task Update(T item);

        public Task Delete(long id);

        public Task SaveChangesAsync(long? id = -1);

    }
}