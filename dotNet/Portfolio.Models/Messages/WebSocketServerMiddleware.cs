﻿using System;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Sabio.Web.Api.StartUp.Messages
{
    public class WebSocketServerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly WebSocketServerConnectionManager _manager;

        public WebSocketServerMiddleware(RequestDelegate next, WebSocketServerConnectionManager manager)
        {
            _next = next;

            _manager = manager;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            
                if (context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();

                    string ConnId = _manager.AddSocket(webSocket);

                    await SendConnIdAsync(webSocket, ConnId);

                    await ReceiveMessage(webSocket, async (result, buffer) =>
                    {
                        if (result.MessageType == WebSocketMessageType.Text)
                        {
                            Console.WriteLine("Message received.");                           

                            Console.WriteLine($"Message:{Encoding.UTF8.GetString(buffer, 0, result.Count)}");

                            await RouteJSONMessageAsync(Encoding.UTF8.GetString(buffer, 0, result.Count));

                            return;
                        }
                        else if (result.MessageType == WebSocketMessageType.Close)
                        {
                            string id = _manager.GetAllSockets().FirstOrDefault(s => s.Value == webSocket).Key;

                            Console.WriteLine("Received close message.");

                            _manager.GetAllSockets().TryRemove(id, out WebSocket sock);

                            await sock.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);

                            return;
                        }
                    });
                }
                else
                {
                    await _next(context);
                }

          
        }

        private async Task SendConnIdAsync(WebSocket socket, string connID)
        {
            var buffer = Encoding.UTF8.GetBytes("ConnID: " + connID);
            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private static async Task ReceiveMessage(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[1024 * 4];
            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer: new ArraySegment<byte>(buffer),
                    cancellationToken: CancellationToken.None);

                handleMessage(result, buffer);
            }
        }

        public async Task RouteJSONMessageAsync(string message)
        {
            var routeOb = JsonConvert.DeserializeObject<dynamic>(message);

            if(Guid.TryParse(routeOb.To.ToString(), out Guid guidOutput))
            {
                Console.WriteLine("Targeted");
                var sock = _manager.GetAllSockets().FirstOrDefault(s=> s.Key == routeOb.To.ToString());

                if(sock.Value != null)
                {
                    if(sock.Value.State == WebSocketState.Open)
                    {
                        await sock.Value.SendAsync(Encoding.UTF8.GetBytes(routeOb.Message.ToString()),
                                WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                   
                }
                else
                {
                    Console.WriteLine("Invalid recipient");
                }
            }
            else
            {
                Console.WriteLine("Broadcast");
                foreach(var sock in _manager.GetAllSockets())
                {
                    if(sock.Value.State == WebSocketState.Open)
                    {
                        await sock.Value.SendAsync(Encoding.UTF8.GetBytes(routeOb.Message.ToString()),
                            WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
            }
        }
    }
}
