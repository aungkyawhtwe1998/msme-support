import React from 'react';
import { MessageDto } from '../models/MessageDto';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
        className={`p-4 w-fit max-w-full rounded-lg ${
          message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {message.content.split('\n').map((text, index) => (
          <React.Fragment key={index}>
            {text}
            <br />
          </React.Fragment>
        ))}
      </div>
  );
};

export default Message;
