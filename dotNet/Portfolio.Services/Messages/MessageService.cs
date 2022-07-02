using Portfolio.Models;
using Portfolio.Models.Domain.Messages;
using Portfolio.Models.Requests.Messages;
using Portfolio.Services.Interfaces;
using System.Data;

namespace Portfolio.Services.Messages
{
    public class MessageService : IMessageService
    {
        private IDataProvider _data = null;

        public MessageService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(MessageAddRequest model)
        {
            string procName = "[dbo].[Messages_Insert]";
            int id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            }
            );
            return id;
        }

        public void Update(MessageUpdateRequest model)
        {
            string procName = "[dbo].[Messages_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Messages_DeleteById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                
                col.AddWithValue("@Id",id);
            },
            returnParameters: null);
        }

        public MessagesBase GetById(int id)
        {
            string procName = "[dbo].[Messages_Select_ById]";
            MessagesBase messageById = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                messageById = MapSingleMessage(reader, ref startingIndex);
            });

            return messageById;
        }

        public Paged<MessagesBase> Paginate(int pageIndex, int pageSize)
        {
            Paged<MessagesBase> pagedList = null;
            List<MessagesBase> messagesList = null;
            int totalCount = 0;

            string procName = "[dbo].[Messages_SelectAll]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);

            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MessagesBase message = MapSingleMessage(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (messagesList == null)
                {
                    messagesList = new List<MessagesBase>();
                }
                messagesList.Add(message);
            });
            if (messagesList != null)
            {
                pagedList = new Paged<MessagesBase>(messagesList, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<MessagesBase> PaginateByCreatedId(int pageIndex, int pageSize, int createdBy)
        {
            Paged<MessagesBase> pagedList = null;
            List<MessagesBase> messagesList = null;
            int totalCount = 0;

            string procName = "[dbo].[Messages_Select_ByCreatedBy]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@CreatedBy", createdBy);

            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MessagesBase message = MapSingleMessage(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (messagesList == null)
                {
                    messagesList = new List<MessagesBase>();
                }
                messagesList.Add(message);
            });
            if (messagesList != null)
            {
                pagedList = new Paged<MessagesBase>(messagesList, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<MessagesBase> PaginateByRecipientId(int pageIndex, int pageSize, int recipientId)
        {
            Paged<MessagesBase> pagedList = null;
            List<MessagesBase> messagesList = null;
            int totalCount = 0;

            string procName = "[dbo].[Messages_Select_ByRece]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@RecipientId", recipientId);

            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MessagesBase message = MapSingleMessage(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (messagesList == null)
                {
                    messagesList = new List<MessagesBase>();
                }
                messagesList.Add(message);
            });
            if (messagesList != null)
            {
                pagedList = new Paged<MessagesBase>(messagesList, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static MessagesBase MapSingleMessage(IDataReader reader, ref int startingIndex)
        {
            MessagesBase newMessage = new MessagesBase();
            newMessage.Id = reader.GetSafeInt32(startingIndex++);
            newMessage.Message = reader.GetSafeString(startingIndex++);
            newMessage.Subject = reader.GetSafeString(startingIndex++);
            newMessage.RecipientId = reader.GetSafeInt32(startingIndex++);
            newMessage.SenderId = reader.GetSafeInt32(startingIndex++);
            newMessage.DateSent = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateRead = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateCreated = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateModified = reader.GetSafeDateTime(startingIndex++);

            return newMessage;
        }

        private static void AddCommonParams(MessageAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Message", model.Message);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@RecipientId", model.RecipientId);
            col.AddWithValue("@SenderId", model.SenderId);
            col.AddWithValue("@DateSent", model.DateSent);
            col.AddWithValue("@DateRead", model.DateRead);
        }
    }
}
