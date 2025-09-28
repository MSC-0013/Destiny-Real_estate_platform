import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Destiny Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(true);

  const quickOptions = [
    { id: 'properties', text: '🏠 Browse Properties', response: 'Great! You can browse our properties by clicking on "Properties" in the navigation menu. We have both sales and rental options available with detailed information about each property.' },
    { id: 'rent', text: '🏠 How to Rent', response: 'To rent a property: 1) Browse our rental listings, 2) Click "Rent Now" on your preferred property, 3) Fill out the rental contract with your details, 4) Complete payment and ID verification, 5) Get your keys and move in!' },
    { id: 'buy', text: '🏡 How to Buy', response: 'To purchase a property: 1) Browse our sales listings, 2) Click "Buy Now" on your chosen property, 3) Complete the purchase contract, 4) Provide ID verification and payment details, 5) Sign the digital contract and become the owner!' },
    { id: 'construction', text: '🏗️ Construction Services', response: 'We offer custom construction services! You can: 1) Request custom property construction, 2) View ongoing construction projects, 3) Work with our certified contractors and designers, 4) Track construction progress in real-time.' },
    { id: 'orders', text: '📋 My Orders', response: 'You can view all your property orders (purchases and rentals) by visiting your Orders page. This shows contract details, payment status, and property information.' },
    { id: 'account', text: '👤 Account Help', response: 'For account management: Visit your profile page to update personal information, view order history, manage your wishlist, and update your preferences.' }
  ];

  const predefinedResponses = {
    'hello': 'Hello! Welcome to Destiny. How can I assist you today?',
    'properties': quickOptions[0].response,
    'rent': quickOptions[1].response,
    'buy': quickOptions[2].response,
    'construction': quickOptions[3].response,
    'orders': quickOptions[4].response,
    'help': 'I can help you with: property browsing, rental/purchase process, construction services, account management, and general questions.',
    'contact': 'For direct contact, you can reach out to property sellers through their contact information on property detail pages.',
    'account': quickOptions[5].response,
    'payment': 'We accept various payment methods including UPI, Credit/Debit Cards, and Net Banking. During the contract process, you\'ll be guided through secure payment options with full encryption.',
    'pricing': 'Our properties have competitive pricing displayed in Indian Rupees (₹). Rental properties show monthly rent, while sale properties show total price. All prices include applicable charges.',
    'default': 'I understand you\'re asking about something. Could you please be more specific? I can help with properties, rentals, purchases, construction, or general questions.'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputMessage;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickOptions(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    handleSendMessage(option.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-80 h-96 shadow-2xl border-0 bg-background/95 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Destiny Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Bot className="h-6 w-6 text-blue-600 mt-1" />
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <User className="h-6 w-6 text-gray-600 mt-1" />
                  )}
                </div>
              ))}
              
              {/* Quick Options */}
              {showQuickOptions && messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Quick options:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="sm"
                        className="text-left justify-start text-xs h-8"
                        onClick={() => handleQuickOption(option)}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendClick} size="icon" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;