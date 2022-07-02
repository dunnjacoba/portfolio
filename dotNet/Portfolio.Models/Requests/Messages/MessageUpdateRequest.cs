using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Models.Requests.Messages
{
    public class MessageUpdateRequest : MessageAddRequest
    {
        public int Id { get; set; }
    }
}
