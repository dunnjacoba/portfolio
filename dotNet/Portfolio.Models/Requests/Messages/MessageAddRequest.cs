using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Models.Requests.Messages
{
    public class MessageAddRequest
    {
        [Required]
        public string Message { get; set; }        
        public string Subject { get; set; }
        [Required]
        public int RecipientId { get; set; }
        [Required]
        public int SenderId { get; set; }       
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
    }
}
