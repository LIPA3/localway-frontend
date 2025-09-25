import { useState, useEffect } from 'react';
import { Send, Paperclip, Mic, X, RefreshCw } from 'lucide-react';
import { chatWithAI } from '../../api/Api';

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 初始化消息历史
  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('解析本地存储消息失败:', e);
        setMessages([
          {
            id: Date.now(),
            role: 'assistant',
            content: '您好！我是您的旅游咨询助手，专注于为您提供深度文化旅游建议。如果您有任何关于行程、景点或文化体验的需求，请随时告诉我！',
          }
        ]);
      }
    } else {
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: '您好！我是您的旅游咨询助手，专注于为您提供深度文化旅游建议。如果您有任何关于行程、景点或文化体验的需求，请随时告诉我！',
        }
      ]);
    }
  }, []);

  // 保存消息到localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // 当对话框关闭时，清空输入框
  useEffect(() => {
    if (!isOpen) {
      setInput('');
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // 只发送最近几条消息，避免请求体过大
      const recentMessages = newMessages.slice(-10); // 只发送最近10条消息
      const context = recentMessages.map(msg => 
        `${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}`
      ).join('\n');
      
      // 调用后端API与AI聊天
      const response = await chatWithAI(context);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
      };
      
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
    } catch (error) {
      // 如果API调用失败，显示错误消息
      console.error('API调用失败:', error);
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，我暂时无法处理您的请求。请确保后端服务正在运行，然后稍后再试。',
      };
      
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    // 清空聊天记录
    const initialMessage = {
      id: Date.now(),
      role: 'assistant',
      content: '您好！我是您的旅游咨询助手，专注于为您提供深度文化旅游建议。如果您有任何关于行程、景点或文化体验的需求，请随时告诉我！',
    };
    setMessages([initialMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 背景遮罩层 */}
      {isOpen && (
        <div 
          className="ai-chat-backdrop" 
          onClick={onClose} 
          aria-hidden="true"
        />
      )}
      
      {/* 对话框 */}
      <div 
        className={`ai-chat fixed top-0 left-0 bottom-0 w-full max-w-md bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ display: isOpen ? 'flex' : 'none', flexDirection: 'column' }}
      >
      {/* 对话框头部 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">智能助手</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="清空聊天记录"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 对话内容区域 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 chat-content">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'user-message' : 'assistant-message shadow-sm'}`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        
        {/* 正在输入提示 */}
        {isTyping && (
          <div className="flex mb-4">
            <div className="bg-white shadow-sm p-3 rounded-lg rounded-bl-none max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="询问关于行程的任何问题..."
            className="flex-1 min-h-[60px] p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            aria-label="发送"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </>
);
};

export default AIChat;