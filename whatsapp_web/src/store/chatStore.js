import { create } from 'zustand';
import { io } from 'socket.io-client';
import api from '../lib/axios';
import useAuthStore from './authStore';

const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  onlineUsers: [],
  socket: null,
  isLoading: false,
  error: null,

  // Initialize Socket.IO connection
  connectSocket: () => {
    const { token, user } = useAuthStore.getState();
    if (!token || !user) return;

    if (get().socket?.connected) return;

    const socket = io('http://127.0.0.1:5000', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('users:online', (users) => {
      set({ onlineUsers: users });
    });

    socket.on('user:online', (data) => {
      set((state) => ({
        onlineUsers: [...state.onlineUsers, data.userId],
      }));
    });

    socket.on('user:offline', (data) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== data.userId),
      }));
    });

    socket.on('message:received', (message) => {
      const { activeChat, chats } = get();
      
      // If message is for currently active chat, append it to messages
      if (
        activeChat &&
        (message.sender._id === activeChat.id || message.receiver._id === activeChat.id)
      ) {
        set((state) => ({
          activeChat: {
            ...state.activeChat,
            messages: [...state.activeChat.messages, message],
          },
        }));

        // Inform server message is read if we are receiver
        if (message.receiver._id === user._id) {
          socket.emit('message:read', { senderId: message.sender._id });
        }
      }

      // Refresh chat list to update last message and unread count
      get().fetchChats();
    });

    socket.on('typing:start', (data) => {
      const { activeChat } = get();
      if (activeChat && activeChat.id === data.userId) {
        set((state) => ({
          activeChat: { ...state.activeChat, isTyping: true },
        }));
      }
    });

    socket.on('typing:stop', (data) => {
      const { activeChat } = get();
      if (activeChat && activeChat.id === data.userId) {
        set((state) => ({
          activeChat: { ...state.activeChat, isTyping: false },
        }));
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/messages/chats');
      
      // Transform backend recent chats to match frontend UI structure
      const formattedChats = response.data.data.map(chat => ({
        id: chat._id,
        name: chat.username,
        avatar: chat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.username}`,
        lastMessage: chat.lastMessage,
        time: new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: chat.unreadCount,
        online: get().onlineUsers.includes(chat._id) || chat.isOnline,
        isTyping: false,
        messages: [], // will be populated when selected
      }));

      set({ chats: formattedChats, isLoading: false });
      
      // Make sure the activeChat reference is correctly updated using the new format
      const currentActive = get().activeChat;
      if (currentActive) {
          set({
              activeChat: {
                  ...currentActive,
                  online: get().onlineUsers.includes(currentActive.id)
              }
          })
      }

    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Needed when user wants to start a new chat with someone not in recent chats
  searchUsers: async (query) => {
     try {
       const response = await api.get('/users');
       return response.data.data.filter(u => u.username.toLowerCase().includes(query.toLowerCase()));
     } catch (error) {
       console.error("Failed to search users", error);
       return [];
     }
  },

  selectChat: async (chatOrUser) => {
    set({ isLoading: true });
    try {
      // It can either be fully populated chat object or just a user object from search
      const userId = chatOrUser.id || chatOrUser._id;
      
      const response = await api.get(`/messages/${useAuthStore.getState().user._id}/${userId}`);
      
      const activeChatData = {
        id: userId,
        name: chatOrUser.name || chatOrUser.username,
        avatar: chatOrUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatOrUser.username}`,
        online: get().onlineUsers.includes(userId) || chatOrUser.isOnline,
        isTyping: false,
        messages: response.data.data, // Attach full message history
        unread: 0
      };

      // Reset unread locally
      set(state => ({
        activeChat: activeChatData,
        chats: state.chats.map(c => c.id === userId ? { ...c, unread: 0 } : c),
        isLoading: false
      }));

    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (text) => {
    const { activeChat, socket } = get();
    if (!activeChat || !text.trim()) return;

    // Send via socket
    socket.emit('message:send', {
      receiver: activeChat.id,
      message: text.trim(),
    });

    // The message will be appended via 'message:received' event (we also receive our own sent messages)
  },

  emitTyping: (isTyping) => {
    const { activeChat, socket } = get();
    if (!activeChat || !socket) return;
    
    socket.emit(isTyping ? 'typing:start' : 'typing:stop', { receiver: activeChat.id });
  }
}));

export default useChatStore;
