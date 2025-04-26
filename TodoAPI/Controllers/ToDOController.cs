using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace TodoAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ToDOController : ControllerBase
    {
        private readonly ILogger<ToDOController> _logger;
        private readonly AppDBContext _context;
        public ToDOController(AppDBContext context, ILogger<ToDOController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //Add to do to the list
        [HttpPost]
        public async Task<ActionResult<ToDoModel>> CreateToDo(ToDoModel todo)
        {
            _context.TodoItems.Add(todo);

            await _context.SaveChangesAsync();

            return Created();
        }

        //Retrieve by id to do item
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoModel>> GetToDoItem(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
                return NotFound();

            return todo;
        }

        //Get all item from to do list
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoModel>>> GetToDoList()

        {
            return await _context.TodoItems.ToListAsync();
        }

        //UPdate to do item
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateToDoItem(int id, ToDoModel todo)
        {

            var todoitem = await _context.TodoItems.FindAsync(id);

            todoitem.Title = todo.Title;
            todoitem.Description = todo.Description;
            todoitem.IsCompleted = todo.IsCompleted;

            _context.Entry(todoitem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return NoContent();
        }

        //delete to do item
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDo(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
                return NotFound();

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
