import json
from channels.generic.websocket import AsyncWebsocketConsumer
from datetime import datetime
import redis


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.disconnect()
        else:
            self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
            self.room_group_name = "chat_%s" % self.room_name

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name, self.channel_name
            )
            self.redis = redis.Redis(host='localhost', port=6379, db=0)

            await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        id = text_data_json['owner']
        timestamp = datetime.now().isoformat()
        
        conversation_key = f"conversation:{self.room_name}"
        self.redis.rpush(conversation_key, json.dumps({"owner": id, "message": message, "timestamp": timestamp}))
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message","owner": id, "message": message, 'timestamp': timestamp}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        id = event["owner"]

        # # Send message to WebSocket
        await self.send(text_data=json.dumps({"owner": id, "message": message, 'timestamp': json.dumps(datetime.now(), indent=4, sort_keys=True, default=str)}))

