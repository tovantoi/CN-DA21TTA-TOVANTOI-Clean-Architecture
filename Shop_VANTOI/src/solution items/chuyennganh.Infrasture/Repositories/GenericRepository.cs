using chuyennganh.Application.Repositories;
using chuyennganh.Domain.Base;
using chuyennganh.Domain.Entities;
using chuyennganh.Infrasture.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using NSubstitute;
using System.Linq.Expressions;

namespace chuyennganh.Infrasture.Repositories
{
    public class GenericRepository<T> : IGenericReponsitory<T> where T : BaseEntity
    {
        private readonly AppDbContext dbContext;
        private readonly ILogger<GenericRepository<T>> logger;

        public GenericRepository(AppDbContext dbContext, ILogger<GenericRepository<T>> logger)
        {
            this.dbContext = dbContext;
            this.logger = logger;
        }
        public async Task<IEnumerable<T>> FindAllAsync(Expression<Func<T, bool>> predicate)
        {
            return await dbContext.Set<T>().Where(predicate).ToListAsync();
        }
        public async Task<T> AddAsync(T entity)
        {
            try
            {
                await dbContext.AddAsync(entity);
                return entity;
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error adding entity to the database!");
                throw;
            }
        }

        public async Task<T?> GetByIdAsync(object id)
        {
            try
            {
                var entity = await dbContext.Set<T>().FindAsync(id);
                if (entity != null)
                {
                    dbContext.Entry(entity).State = EntityState.Detached;
                }
                return entity;
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error retrieving entity from the database!");
                throw;
            }
        }

        public async Task DeleteAsync(object id)
        {
            try
            {
                var entity = await GetByIdAsync(id);
                if (entity != null)
                {
                    dbContext.Remove(entity);
                }
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error deleting entity from the database!");
                throw;
            }
        }

        public Task UpdateAsync(T entity)
        {
            try
            {
                dbContext.Entry(entity).State = EntityState.Modified;
                return Task.CompletedTask;
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error updating entity in the database!");
                throw;
            }
        }
        public async Task<IReadOnlyList<T>> GetAll()
        {
            try
            {
                return await dbContext.Set<T>().ToListAsync(); 
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error retrieving all entities from the database!");
                throw;
            }
        }

        public async Task<T> GetById(int Id)
        {
            try
            {
                // Truy vấn entity với ProductId
                return await dbContext.Set<T>().FindAsync(Id);
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error retrieving entity by ProductId from the database!");
                throw;
            }
        }
        public async Task<(List<int>? existingIds, List<int>? missingIds)> CheckIdsExistAsync(List<int>? ids)
        {
            try
            {
                ids = ids.Distinct().ToList() ?? new List<int>();
                var existingIds = await dbContext.Set<Category>()
                                       .Where(category => category.Id.HasValue && ids.Contains(category.Id.Value))
                                       .Select(category => category.Id.Value)
                                       .ToListAsync();
                var missingIds = ids.Except(existingIds).ToList();
                return (existingIds, missingIds);
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error retrieving entity by ProductId from the database!");
                throw;
            }
        }

        public async Task<T?> FindSingleAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
        {
            var query = dbContext.Set<T>().AsQueryable();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            var result = predicate is not null ? await query.FirstOrDefaultAsync(predicate) : await query.FirstOrDefaultAsync();
            return result;
        }
        public IQueryable<T> FindAll(Expression<Func<T, bool>>? predicate = null, params Expression<Func<T, object>>[] includeProperties)
        {
            var query = dbContext.Set<T>().AsQueryable();
            if (includeProperties.Any())
            {
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty);
                }
            }
            return predicate is not null ? query.Where(predicate) : query;
        }
        public void RemoveMultiple(IEnumerable<T> entities)
        {
            dbContext.Set<T>().RemoveRange(entities);
        }
        public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await dbContext.Set<T>().FirstOrDefaultAsync(predicate);
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error finding entity from the database!");
                throw;
            }
        }
        public Task SaveChangeAsync() => dbContext.SaveChangesAsync();

        public IDbContextTransaction BeginTransaction()
        {
            return dbContext.Database.BeginTransaction();
        }
    }
}
