using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Unit to check if no result was created.
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            // Fluent validator, not using attributes.
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
				_userAccessor = userAccessor;
			}

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername());
                
                var attendee = new ActivityAttendee 
                {
                    User = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(attendee);

                // Here we're adding an activity into our context in memory, not in the db
                // therefore, we don't need to use AddAsync.
                _context.Activities.Add(request.Activity);
                
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create activity");

                // Unit just tells our API that this method has finalized. It's not an actual
                // value of anything. Equivalent to nothing.
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}