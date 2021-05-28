using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Here we're adding an activity into our context in memory, not in the db
                // therefore, we don't need to use AddAsync.
                _context.Activities.Add(request.Activity);
                
                await _context.SaveChangesAsync();

                // Unit just tells our API that this method has finalized. It's not an actual
                // value of anything. Equivalent to nothing.
                return Unit.Value;
            }
        }
    }
}