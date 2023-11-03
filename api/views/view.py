from typing import List
from fastapi import WebSocket



class ConnectionManager:

    def __init__(self):
        self.connected_clients: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connected_clients.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connected_clients.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.connected_clients:
            await connection.send_text(message)


