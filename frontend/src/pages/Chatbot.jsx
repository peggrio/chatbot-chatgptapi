import React from "react";
import { useState } from 'react';
import { GoDependabot } from "react-icons/go";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./Chatbot.css"
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"
const Chatbot = () => {
    const [typing, setTyping] = useState(false);

    const [messages, setMessage] = useState([
        {
            message: "Hello, this is Traval Leader, your reliable travel butler, what can I help you today?",
            sender: "Traval Leader"
        }
    ])

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }

        const newMessages = [...messages, newMessage];// all the old messages + the new message
        setMessage(newMessages);

        //set a typing indicator
        setTyping(true);
    }

    return (
        <div>
            hello this is chatbot
            <GoDependabot size={35} />
            <div>
                <MainContainer>
                    <ChatContainer>
                        <MessageList typingIndicator={typing ? <TypingIndicator /> : null}>
                            {messages.map((message, i) => {
                                return <Message className="haha-input" key={i} model={message} />
                            })}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Chatbot