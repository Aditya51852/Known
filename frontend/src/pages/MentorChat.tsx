import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mentor';
  timestamp: string;
}

export default function MentorChat() {
  const { mentorId } = useParams();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi John Doe! Welcome to our mentorship program. I'm excited to help you find your perfect car. What kind of vehicle are you looking for?",
      sender: 'mentor',
      timestamp: '02:45 AM'
    },
    {
      id: '2',
      text: "Hello! I'm looking for a reliable sedan for daily commuting, preferably fuel-efficient.",
      sender: 'user',
      timestamp: '02:50 AM'
    },
    {
      id: '3',
      text: "Great choice! Sedans are perfect for commuting. What's your budget range, and do you have any brand preferences?",
      sender: 'mentor',
      timestamp: '02:55 AM'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock mentor data
  const mentor = {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    initials: 'DSC',
    rating: 4.9,
    expertise: 'Automotive Expert',
    phone: '+91 9876543210',
    status: 'online',
    about: 'Expert in automotive technology and sustainable transportation solutions'
  };

  const planDetails = {
    hourly: { name: 'Hourly Plan', duration: 'Valid till plan duration' },
    basic: { name: 'Basic Plan', duration: 'Valid till plan duration' },
    economic: { name: 'Economic Plan', duration: 'Valid till plan duration' }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.basic;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate mentor response
      setTimeout(() => {
        const mentorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "That's helpful information! Let me suggest some options based on your requirements.",
          sender: 'mentor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, mentorResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
          {/* Left Sidebar - Profile & Mentor Info */}
          <div className="lg:col-span-1 bg-white border-r border-gray-200 flex flex-col">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600 mx-auto mb-3">
                  JD
                </div>
                <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Mentor Assigned
                </div>
                <div className="flex items-center justify-center text-gray-600 mt-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  john.doe@gmail.com
                </div>
              </div>
            </div>

            {/* Mentor Info Section */}
            <div className="p-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mentor</h3>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                    {mentor.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {mentor.rating} • {mentor.expertise}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {mentor.phone}
                </div>
                
                <div className="text-sm text-blue-600 font-medium mb-3">
                  Plan: {currentPlan.name}
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{mentor.about}</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Call
                  </button>
                  <button className="border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                    </svg>
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-2 flex flex-col h-screen">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Live Chat Section</h2>
                </div>
                <span className="text-sm text-green-600">Dr. Sarah Chen is online</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
