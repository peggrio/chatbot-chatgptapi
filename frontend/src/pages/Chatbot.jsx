import React from "react";
import { useState } from 'react';
import { GoDependabot } from "react-icons/go";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./Chatbot.css"
import axios from "axios";

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Chatbot = () => {
    const [typing, setTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
            message: "Hello, this is Traval Leader, your reliable travel butler, how can I help you today?",
            sender: "chatGPT"
        }
    ])

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }

        const allMessages = [...messages, newMessage];// all the old messages + the new message
        setMessages(allMessages);

        //set a typing indicator
        setTyping(true);

        await proccessMessage(allMessages, message);
    }

    const proccessMessage = async (allMessages, chatMessage) => {

        const apiReqBody = {
            "content": chatMessage
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/chatbot`,
                apiReqBody,
                { withCredentials: true }
            );
            if (response.statusText === 'OK') {
                // console.log(response.data.message.content)
                setMessages(
                    [...allMessages, {
                        message: response.data.message.content,
                        sender: "chatGPT"
                    }]
                );
                setTyping(false);
            }
        } catch (error) {
            console.log(error.message);
        }
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
                                return <Message key={i} model={message} />
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