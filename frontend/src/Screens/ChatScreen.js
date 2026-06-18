import React, { useState, useEffect } from "react";
import ColumnLayout from "../app/Components/Layout/ColumnLayout";
import RightColumnChatComponent from "../app/Components/Layout/Columns/ChatColumn/RightColumnChatComponent";
import ChatMiddleColumnComponent from "../app/Components/Layout/Columns/ChatColumn/ChatMiddleComponent";
import { useParams } from "react-router-dom";

function ChatSreen() {
  const { id: conversation_id } = useParams();
  const [middleColumn, setMiddleColumn] = useState();
  useEffect(() => {
    if (conversation_id) {
      setMiddleColumn(
        <ChatMiddleColumnComponent conversation_id={conversation_id} />
      );
    } else {
      setMiddleColumn(null);
    }
  }, [conversation_id]);
  return (
    <ColumnLayout
      RightColumnExist={false}
      RightColumnContent={<RightColumnChatComponent />}
      middleColumn={middleColumn}
    />
  );
}

export default ChatSreen;
