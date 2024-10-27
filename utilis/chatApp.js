import { io } from '../server.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './users.js';
import formatMessage from './messages.js';
import Chat from '../models/chatModel.js';

const botName = 'Chat Bot';

const chatApp = async() => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', async (username) => {
      const user = userJoin(socket.id, username, 'chat');
      socket.join(user.room);

      // Send welcome message
      socket.emit('message', formatMessage(botName, `${username || 'Anonymous'} Welcome to Chat!`));

      // Notify others
      socket.broadcast.to(user.room).emit('message', 
        formatMessage(botName, `${username || 'Anonymous'} has joined the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      try {
        // Fetch previous messages
        const messages = await Chat.find({ room: user.room })
          .sort({ createdAt: 1 })  // Sort by timestamp
          .limit(50);  // Limit to last 50 messages

        // Send previous messages
        messages.forEach((message) => {
          socket.emit('message', formatMessage(
            message.name,
            message.content,
            message.createdAt  // Include the original timestamp
          ));
        });
      } catch (error) {
        console.error('Error fetching previous messages:', error);
        socket.emit('message', formatMessage(botName, 'Error loading chat history'));
      }
    });

    socket.on('chatMessage', async (message) => {
      const user = getCurrentUser(socket.id);
      if (user) {
        try {
          // Save message to database
          const newMessage = await Chat.create({
            name: user.username,
            room: user.room,
            content: message,
          });

          // Broadcast the message
          io.to(user.room).emit('message', formatMessage(
            user.username,
            message,
            newMessage.createdAt  // Use the timestamp from the database
          ));
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('message', formatMessage(botName, 'Error saving message'));
        }
      }
    });

    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit('message', 
          formatMessage(botName, `${user.username} has left the chat`)
        );

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};

export default chatApp;