import api from './axios'

export const chatService = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
  clearChat: () => api.delete('/chat/clear'),
}