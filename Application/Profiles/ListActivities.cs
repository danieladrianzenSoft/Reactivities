using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace Application.Profiles
{
	public class ListActivities
	{
		public class Query : IRequest<Result<List<UserActivityDto>>>
		{
			public string Predicate { get; set; }
            public string Username { get; set; }
		}

		public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
		{
			private readonly DataContext _context;
			private readonly IMapper _mapper;
			public Handler(DataContext context, IMapper mapper)
			{
				_mapper = mapper;
				_context = context;
			}

			public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
			{
				var query = _context.ActivityAttendees
                    .OrderBy(d => d.Activity.Date)
                    .Where(a => a.User.UserName == request.Username)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past": 
                        query = query.Where(d => d.Date <= DateTime.UtcNow);
                        break;
                    case "hosting":
                        query = query.Where(d => d.HostUsername == request.Username);
                        break;
                    default: 
                        query = query.Where(a => a.Date >= DateTime.Now);
                        break;
                };

                var activities = await query.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);

			}
		}

	}
}