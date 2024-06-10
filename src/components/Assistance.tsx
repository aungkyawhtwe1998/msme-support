import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import OpenAI from "openai";
import { MessageDto } from "../models/MessageDto";
import { BotMessageSquareIcon, SendHorizonalIcon } from "lucide-react";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    if (assistant) {
      setMessages([
        {
          content: "Hi, I'm your personal assistant. How can I help you?",
          isUser: false,
        },
      ]);
    }
  }, [assistant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const assistant = await openai.beta.assistants.create({
      name: "Business Advisor",
      instructions:
        "You are a business advisor. You specialize in providing advice for MSMEs.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-3.5-turbo",
    });

    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!openai || !thread || !assistant || !input) return;

    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput("");

    try {
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: input,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      const startTime = Date.now();
      const timeout = 30000; // 30 seconds

      while (
        response.status === "in_progress" ||
        response.status === "queued"
      ) {
        if (Date.now() - startTime > timeout) {
          console.error("Timeout waiting for the assistant to respond.");
          setIsWaiting(false);
          return;
        }
        setIsWaiting(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      setIsWaiting(false);

      if (response.status !== "completed") {
        console.error("Assistant run failed or was cancelled:", response);
        return;
      }

      const messageList = await openai.beta.threads.messages.list(thread.id);

      const lastMessage = messageList.data
        .filter(
          (message: any) =>
            message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      if (lastMessage) {
        setMessages([
          ...messages,
          createNewMessage(lastMessage.content[0]["text"].value, false),
        ]);
      }
    } catch (error) {
      console.error("Error during message handling:", error);
      setIsWaiting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:min-h-[80vh] px-4 py-6">
      <h1 className="text-3xl text-gray-700 border-b border-gray-100 pb-5 font-extrabold mb-5">
        Your Business <span className="text-blue-600">Assistance</span>
      </h1>
      <div className="max-h-[60vh] overflow-y-scroll">
        <div className="flex flex-col flex-grow w-full max-w-3xl mb-5">
          {messages.map((message, index) => (
            <div
              className={`flex gap-2 ${
                message.isUser ? "justify-end" : "justify-start"
              } mb-2`}
              key={index}>
              {!message.isUser && <BotMessageSquareIcon />}
              <Message message={message} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky bottom-5 border-t border-gray-100 pt-5 bg-white w-full max-w-3xl">
        <div className="flex mx-2 justify-between items-center">
          <input
            type="text"
            placeholder="Type your message"
            className="w-full p-2 border rounded mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting ? (
            <div
              className="spinner-border text-primary"
              role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleSendMessage}
              disabled={!input}>
              <SendHorizonalIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
