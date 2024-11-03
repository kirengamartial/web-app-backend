import { io } from '../server.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './users.js';
import formatMessage from './messages.js';
import Chat from '../models/chatModel.js';

const botName = 'Chat Bot';

const chatApp = async() => {
  // First, ensure we remove any unique index on the room field if it exists
  try {
    await Chat.collection.dropIndex('room_1');
  } catch (error) {
    // Index might not exist, which is fine
    console.log('No existing room index to drop');
  }

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

      try {
        // Fetch previous messages with proper error handling
        const messages = await Chat.find({ room: user.room })
          .sort({ createdAt: -1 })  // Sort by timestamp descending
          .limit(50)
          .lean();  // Convert to plain JavaScript objects for better performance

        // Send previous messages in chronological order
        messages.reverse().forEach((message) => {
          socket.emit('message', formatMessage(
            message.name,
            message.content,
            message.createdAt
          ));
        });

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
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
          // Create new message with proper error handling
          const newMessage = new Chat({
            name: user.username,
            room: user.room,
            content: message,
          });

          await newMessage.save();

          // Broadcast the message
          io.to(user.room).emit('message', formatMessage(
            user.username,
            message,
            newMessage.createdAt
          ));
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('message', formatMessage(botName, 'Error saving message'));
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit('message', 
          formatMessage(botName, `${user.username} has left the chat`)
        );

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });
};

export default chatApp;