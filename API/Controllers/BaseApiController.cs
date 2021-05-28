using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        // protected means this property is going to be available in baseapi controller and all child
        // controllers. ??= is the null coalescing assigning operator. If null, evaluate and assign whatever
        // is to the right, which is the mediator service.
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices
            .GetService<IMediator>();
    }
}