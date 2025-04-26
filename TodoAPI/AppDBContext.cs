using Microsoft.EntityFrameworkCore;
using System;

namespace TodoAPI
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        public DbSet<ToDoModel> TodoItems => Set<ToDoModel>();
    }
}
