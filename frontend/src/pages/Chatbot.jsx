import React from "react";
import { useState } from 'react';
import { GoDependabot } from "react-icons/go";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./Chatbot.css"
import robotAvatar from "../assets/robot.svg";
import user1 from "../assets/usr1.svg"
import user2 from "../assets/usr2.svg"
import user3 from "../assets/usr3.svg"
import user4 from "../assets/usr4.svg"
import ava1 from "../assets/ava1.svg"
import ava2 from "../assets/ava2.svg"
import ava3 from "../assets/ava3.svg"
import ava4 from "../assets/ava4.svg"
import ava5 from "../assets/ava5.svg"
import axios from "axios";

import { Avatar, MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, MessageSeparator } from "@chatscope/chat-ui-kit-react"

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
        // Sanitize the message to remove any HTML formatting
        var doc = new DOMParser().parseFromString(message, 'text/html');
        const sanitizedMessage = doc.body.textContent || "";

        const newMessage = {
            message: sanitizedMessage,
            sender: "user",
            direction: "outgoing"
        }

        const allMessages = [...messages, newMessage];// all the old messages + the new message
        setMessages(allMessages);

        //set a typing indicator
        setTyping(true);

        await proccessMessage(allMessages, sanitizedMessage);
    }

    const [avatars_user, setAvatarUsers] = useState([
        user1
    ])
    const [avatar_robot, setAvatarRobots] = useState([
        ava1
    ])

    const handlePickAvatars = async () => {
        // Generate a random index within the range of the array length
        const options = [user1, user2, user3, user4]
        const randomIndex = Math.floor(Math.random() * options.length);
        // Return the avatar at the randomly generated index
        setAvatarUsers(options[randomIndex]);
    }

    const handlePickRobots = async () => {
        // Generate a random index within the range of the array length
        const options = [ava1, ava2, ava3, ava4, ava5]
        const randomIndex = Math.floor(Math.random() * options.length);
        // Return the avatar at the randomly generated index
        setAvatarRobots(options[randomIndex]);
    }

    const proccessMessage = async (allMessages, chatMessage) => {

        const apiReqBody = {
            "content": chatMessage
        }
        console.log("message input:", chatMessage);

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
        <div >
            <div class="robot-title">
                Hello this is chatbot
                <GoDependabot size={35} />
            </div>
            <div>
                <MainContainer>
                    <ChatContainer>
                        <MessageList typingIndicator={typing ? <TypingIndicator /> : null}>
                            <MessageSeparator
                                as="h2"
                                content="Wednesday, 13 March 2024"
                            />
                            {messages.map((message, i) => {
                                if (message.sender === "user") {
                                    return <Message key={i} model={message} >
                                        <Avatar
                                            name="Robot"
                                            src={avatars_user}
                                            status="available"
                                            onClick={handlePickAvatars}
                                        />
                                    </Message>
                                } else {
                                    return <Message key={i} model={message} >
                                        <Avatar
                                            name="Robot"
                                            src={avatar_robot}
                                            status="available"
                                            onClick={handlePickRobots}
                                        />
                                    </Message>
                                }
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