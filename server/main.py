"""
WiFiSense — servidor MVP (processamento + API + WebSocket).

ESP32 → este servidor → React
O frontend nunca recebe CSI bruto: apenas posição, movimento e qualidade.
"""

from __future__ import annotations

import asyncio
import json
import math
import time
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="WiFiSense", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STARTED_AT = time.time()

FLOOR_PLAN = {
    "id": "home-demo",
    "name": "Residência Demo",
    "width": 10,
    "height": 8,
    "walls": [
        {"id": "w1", "from": {"x": 0, "y": 0}, "to": {"x": 10, "y": 0}},
        {"id": "w2", "from": {"x": 10, "y": 0}, "to": {"x": 10, "y": 8}},
        {"id": "w3", "from": {"x": 10, "y": 8}, "to": {"x": 0, "y": 8}},
        {"id": "w4", "from": {"x": 0, "y": 8}, "to": {"x": 0, "y": 0}},
        {"id": "w5", "from": {"x": 5, "y": 0}, "to": {"x": 5, "y": 4.5}},
        {"id": "w6", "from": {"x": 0, "y": 4.5}, "to": {"x": 5, "y": 4.5}},
    ],
    "features": [
        {"id": "d1", "kind": "door", "from": {"x": 2.2, "y": 4.5}, "to": {"x": 3.2, "y": 4.5}},
        {"id": "d2", "kind": "door", "from": {"x": 5, "y": 2}, "to": {"x": 5, "y": 3}},
        {"id": "win1", "kind": "window", "from": {"x": 1, "y": 0}, "to": {"x": 2.5, "y": 0}},
        {"id": "win2", "kind": "window", "from": {"x": 6.5, "y": 0}, "to": {"x": 8.5, "y": 0}},
        {"id": "win3", "kind": "window", "from": {"x": 10, "y": 3}, "to": {"x": 10, "y": 5}},
    ],
    "sensors": [
        {
            "id": "esp32-1",
            "name": "ESP32 Sala",
            "position": {"x": 7.5, "y": 6},
            "active": True,
            "rssi": -42,
        },
        {
            "id": "esp32-2",
            "name": "ESP32 Quarto",
            "position": {"x": 2.5, "y": 2},
            "active": True,
            "rssi": -48,
        },
    ],
}


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "uptimeMs": int((time.time() - STARTED_AT) * 1000)}


@app.get("/api/floor-plan")
async def floor_plan() -> dict[str, Any]:
    return FLOOR_PLAN


@app.get("/api/metrics")
async def metrics() -> dict[str, Any]:
    return {
        "fps": 0,
        "latencyMs": 0,
        "packetsReceived": 0,
        "processingTimeMs": 0,
        "peopleDetected": 0,
        "sensorsActive": 2,
        "connectionStatus": "connected",
    }


class ConnectionManager:
    def __init__(self) -> None:
        self.active: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active:
            self.active.remove(websocket)

    async def broadcast(self, message: dict[str, Any]) -> None:
        dead: list[WebSocket] = []
        data = json.dumps(message)
        for ws in self.active:
            try:
                await ws.send_text(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


def build_detection(angle: float, packets: int) -> dict[str, Any]:
    now = int(time.time() * 1000)
    return {
        "type": "detection",
        "timestamp": now,
        "payload": {
            "id": "person-1",
            "position": {
                "x": 5 + math.cos(angle) * 2.2,
                "y": 4 + math.sin(angle) * 1.6,
            },
            "movement": {
                "direction": (math.degrees(angle) + 90) % 360,
                "speed": 0.6 + math.sin(angle) * 0.2,
            },
            "quality": {"confidence": 0.72 + math.sin(angle * 2) * 0.15},
            "timestamp": now,
        },
    }, {
        "type": "metrics",
        "timestamp": now,
        "payload": {
            "fps": 10,
            "latencyMs": 20,
            "packetsReceived": packets,
            "processingTimeMs": 5,
            "peopleDetected": 1,
            "sensorsActive": 2,
            "connectionStatus": "connected",
        },
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    angle = 0.0
    packets = 0
    try:
        await websocket.send_text(
            json.dumps(
                {
                    "type": "log",
                    "timestamp": int(time.time() * 1000),
                    "payload": {
                        "id": "log-boot",
                        "level": "info",
                        "message": "WebSocket conectado ao servidor Python",
                        "timestamp": int(time.time() * 1000),
                    },
                }
            )
        )
        while True:
            angle += 0.08
            packets += 1
            detection, metrics_msg = build_detection(angle, packets)
            await websocket.send_text(json.dumps(detection))
            await websocket.send_text(json.dumps(metrics_msg))
            if packets % 50 == 0:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "log",
                            "timestamp": int(time.time() * 1000),
                            "payload": {
                                "id": f"log-{packets}",
                                "level": "debug",
                                "message": f"Pacote #{packets} processado",
                                "timestamp": int(time.time() * 1000),
                                "meta": {"processingTimeMs": 5},
                            },
                        }
                    )
                )
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
