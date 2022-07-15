using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace Sabio.Web.Api.StartUp.Messages
{
    public class WebSocketServerConnectionManager
    {
        private ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        public ConcurrentDictionary<string, WebSocket> GetAllSockets()
        {
            return _sockets;
        }

        public string AddSocket(WebSocket socket)
        {
            string ConnId = Guid.NewGuid().ToString();
            _sockets.TryAdd(ConnId, socket);
            Console.WriteLine("Connection Added" + ConnId);

            return ConnId;
        }
    }
}
