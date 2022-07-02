using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Web.Api.Controllers
{
    [Route("api/messages")]

    [ApiController]
    public class MessagesApiController : BaseApiController
    {
        private IMessageService _service = null;
        private IAuthenticationService<int> _authService = null;
        public MessagesApiController(IMessageService service
            , IAuthenticationService<int> authService
            , ILogger<MessagesApiController> logger) :base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<MessagesBase>> GetById(int Id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                MessagesBase message = _service.GetById(Id);

                if(message == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found");
                }
                else
                {
                    response = new ItemResponse<MessagesBase> { Item = message};
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

        [HttpGet("paginate/rece")]
        public ActionResult<ItemResponse<Paged<MessagesBase>>> GetPaginated(int pageIndex, int pageSize, int recipientId)
        {
            int iCode = 200;
            BaseResponse baseResponse = null;
            try
            {
                Paged<MessagesBase> paged = _service.PaginateByRecipientId(pageIndex, pageSize, recipientId);
                if (paged == null)
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Records Not Found");
                }
                else
                {
                    baseResponse = new ItemResponse<Paged<MessagesBase>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                baseResponse = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, baseResponse);
        }

        [HttpGet("paginate/origin")]
        public ActionResult<ItemResponse<Paged<MessagesBase>>> GetPaginatedCreated(int pageIndex, int pageSize, int createdBy)
        {
            int iCode = 200;
            BaseResponse baseResponse = null;
            try
            {
                Paged<MessagesBase> paged = _service.PaginateByCreatedId(pageIndex, pageSize, createdBy);
                if (paged == null)
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Records Not Found");
                }
                else
                {
                    baseResponse = new ItemResponse<Paged<MessagesBase>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                baseResponse = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, baseResponse);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<MessagesBase>>> GetPaginated(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse baseResponse = null;
            try
            {
                Paged<MessagesBase> paged = _service.Paginate(pageIndex, pageSize);
                if(paged == null)
                {
                    iCode = 404;
                    baseResponse = new ErrorResponse("Records Not Found");
                }
                else
                {
                    baseResponse = new ItemResponse<Paged<MessagesBase>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                baseResponse = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, baseResponse);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(MessageAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int id = _service.Add(model);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id};

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode=500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<MessagesBase>> Update(MessageUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response= new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

    }


}
