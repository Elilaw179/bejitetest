import axiosInstance from '../utils/axiosInstance';

// Messaging API service
const messagingService = {
  // Get user conversations
  async getConversations() {
    try {
      const response = await axiosInstance.get('/conversations');
      return response.data.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Search users for starting conversations
  async searchUsers(query, limit = 20, offset = 0) {
    try {
      const response = await axiosInstance.get('/api/connections/search', {
        params: { q: query, limit, offset }
      });
      return response.data.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Start or get conversation with another user
async startConversation(otherUserId) {
    try {
      const response = await axiosInstance.post('/conversations/start', {
        other_user_id: String(otherUserId)
      });
      return response.data.conversation;
    } catch (error) {
      console.error('Error starting conversation:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId, page = 1) {
    try {
      const response = await axiosInstance.get(`/messages/${conversationId}?page=${page}`);
      return response.data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(conversationId, content, imageUrl = null) {
    try {
      const messageData = {
        conversation_id: conversationId,
        content: content
      };
      if (imageUrl) {
        messageData.image_url = imageUrl;
      }
      const response = await axiosInstance.post('/messages', messageData);
      return response.data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Edit a message
  async editMessage(messageId, content) {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}`, {
        content: content
      });
      return response.data.message;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await axiosInstance.delete(`/messages/${messageId}`);
      return response.data.message;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Get total unread message count across all conversations
  async getUnreadCount() {
    try {
      const response = await axiosInstance.get('/conversations/unread-count');
      return response.data.unread_count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Mark a conversation as read
  async markConversationRead(conversationId) {
    try {
      const response = await axiosInstance.post(`/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }
};

export default messagingService;