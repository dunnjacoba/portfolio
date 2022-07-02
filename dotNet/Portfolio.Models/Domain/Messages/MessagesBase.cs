using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Models.Domain.Messages
{
    public class MessagesBase
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
        public int RecipientId { get; set; }
        public int SenderId { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }
}
