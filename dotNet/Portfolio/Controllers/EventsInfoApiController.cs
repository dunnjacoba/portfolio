using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Web.Api.Controllers
{
    [Route("api/eventsinfo")]
    [ApiController]
    public class EventsInfoApiController : BaseApiController
    {
        private IEventInfoService _service = null;
        private IAuthenticationService<int> _authService = null;

        public EventsInfoApiController(IEventInfoService service, IAuthenticationService<int> authService, ILogger<EventsInfoApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }


        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<EventInfo>>> Pagination(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<EventInfo> paged = _service.Paginate(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Events Not Found"));
                }
                else
                {
                   ItemResponse<Paged<EventInfo>> response = new ItemResponse<Paged<EventInfo>>();
                   response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<EventInfo>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                EventInfo aEventInfo = _service.GetById(id);

                if (aEventInfo == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Event not found.");
                }
                else
                {
                    response = new ItemResponse<EventInfo> { Item = aEventInfo };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }


    }
}
