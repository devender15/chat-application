from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from datetime import datetime
import json
from api.views.view import ConnectionManager

router = APIRouter()


# intantiating the ConnectionManager class
manager = ConnectionManager()


@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    try:
        while 1:
            data = await websocket.receive_text()
            message = {"time": current_time,
                       "client_id": client_id, "message": data}
            await manager.broadcast(json.dumps(message))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"time": current_time,
                   "clientId": client_id, "message": "Offline"}
        await manager.broadcast(json.dumps(message))
        
        raise HTTPException(status_code=500, detail="Someone left the chat!")