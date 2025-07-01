import React, { useState } from 'react';
import { Bot, Send, MessageCircle, TrendingUp, Target } from 'lucide-react';

const mockConversation = [
  {
    id: '1',
    type: 'ai',
    message: "Hello! I'm your AI financial advisor. I've analyzed your portfolio and have some recommendations. How can I help you today?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    type: 'user',
    message: "What should I focus on to reach my retirement goal faster?",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    type: 'ai',
    message: "Based on your current savings rate and portfolio, here are my top 3 recommendations:\n\n1. **Increase 401(k) contribution** by $200/month to maximize employer match\n2. **Rebalance portfolio** - you're heavy on real estate (67%), consider more stocks\n3. **Tax optimization** - consider Roth IRA conversion for long-term savings\n\nThese changes could accelerate your timeline by 3-4 years!",
    timestamp: new Date(Date.now() - 180000),
  },
];

export default function AIAdvisor() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState(mockConversation);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: message.trim(),
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: "I'm analyzing your question and current financial situation. This feature is coming soon with full AI integration!",
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Financial Advisor</h1>
              <p className="text-sm text-gray-600">Get personalized advice for your goals</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-success-600">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span>Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-medium">AI Advisor</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                <div className={`text-xs mt-2 ${
                  msg.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 border-t border-gray-100">
          <div className="flex space-x-2 mb-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm hover:bg-primary-100 transition-colors">
              <Target className="w-4 h-4" />
              <span>Goal Analysis</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-success-50 text-success-700 rounded-lg text-sm hover:bg-success-100 transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Portfolio Review</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-warning-50 text-warning-700 rounded-lg text-sm hover:bg-warning-100 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Scenario Planning</span>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your financial strategy..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI advisor is powered by advanced algorithms and your financial data
          </p>
        </div>
      </div>
    </div>
  );
}