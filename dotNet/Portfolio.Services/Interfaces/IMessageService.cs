using Portfolio.Models;
using Portfolio.Models.Domain.Messages;
using Portfolio.Models.Requests.Messages;

namespace Portfolio.Services.Interfaces
{
    public interface IMessageService
    {
        int Add(MessageAddRequest model);
        void Delete(int id);
        MessagesBase GetById(int id);
        Paged<MessagesBase> Paginate(int pageIndex, int pageSize);
        Paged<MessagesBase> PaginateByCreatedId(int pageIndex, int pageSize, int createdBy);
        Paged<MessagesBase> PaginateByRecipientId(int pageIndex, int pageSize, int recipientId);
        void Update(MessageUpdateRequest model);
    }
}