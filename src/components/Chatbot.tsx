import React, { useState, useEffect, useRef } from 'react';
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

interface QuickOption {
  id: string;
  text: string;
  response: string;
  subOptions?: QuickOption[];
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm Destiny Assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [subOptionsToShow, setSubOptionsToShow] = useState<QuickOption[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let resetQuickOptionsTimeout: any;

  const quickOptions: QuickOption[] = [
    {
      id: 'properties',
      text: '🏠 Browse Properties',
      response: `🔹 Explore our extensive property listings tailored to your preferences.  
🔹 You can filter properties by type, category, location, price range, and amenities.  
🔹 Each listing includes photos 🖼️, description 📝, price 💲, and seller info 📞.`,
      subOptions: [
        { id: 'sale', text: '💰 Properties for Sale', response: 'Here are properties available for sale. Filter by location, price, or type.' },
        { id: 'rent', text: '🏠 Properties for Rent', response: 'Here are properties available for rent. Use filters for price, location, and type.' },
        { id: 'luxury', text: '🌟 Luxury Properties', response: 'Check out premium and luxury properties with exclusive amenities.' },
        { id: 'nearby', text: '📍 Properties Nearby', response: 'View properties near your current location or a selected area.' },
        { id: 'amenities', text: '⚡ Properties by Amenities', response: 'Filter properties by amenities like pool 🏊, gym 🏋️, parking 🚗, garden 🌳.' }
      ]
    },
    {
      id: 'rent',
      text: '🏠 How to Rent',
      response: `🔹 Renting a property with Destiny is simple!  
1️⃣ Browse listings → select property → click "Rent Now" 🖱️  
2️⃣ Fill out rental agreement 📝  
3️⃣ Complete secure payment 💳 and ID verification 🆔  
4️⃣ Receive your keys 🗝️ and move in 🏡`,
      subOptions: [
        { id: 'short-term', text: '⏳ Short-term Rentals', response: 'Explore short-term rental options with flexible durations.' },
        { id: 'long-term', text: '📅 Long-term Rentals', response: 'View long-term rental options suitable for families or professionals.' },
        { id: 'documents', text: '📄 Required Documents', response: 'You need ID proof 🆔, address proof 🏠, and sometimes employment proof 💼.' },
        { id: 'payment-methods', text: '💳 Payment Methods', response: 'We accept UPI, Credit/Debit cards, Net Banking, and more.' }
      ]
    },
    {
      id: 'buy',
      text: '🏡 How to Buy',
      response: `🔹 Buying a property is simple:  
1️⃣ Browse sale listings 🏠🏘️🏢  
2️⃣ Click "Buy Now" 🖱️  
3️⃣ Complete purchase agreement 📝  
4️⃣ ID verification 🆔 & secure payment ✅  
5️⃣ Sign contract ✍️ & become owner 🏡`,
      subOptions: [
        { id: 'finance', text: '💵 Financing Options', response: 'Learn about home loans, EMI plans, and financial guidance.' },
        { id: 'legal', text: '⚖️ Legal Guidance', response: 'Destiny provides legal support for contracts and property verification.' },
        { id: 'inspection', text: '🔍 Property Inspection', response: 'Schedule property inspection before purchasing. Inspect documents and physical property.' },
        { id: 'negotiation', text: '🤝 Price Negotiation', response: 'Learn tips for negotiating property price and closing the deal efficiently.' }
      ]
    },
    {
      id: 'construction',
      text: '🏗️ Construction Services',
      response: `🔹 Professional construction services:  
→ Request a custom project 🏠🏢  
→ Collaborate with contractors 👷‍♂️ & designers 🎨  
→ Track progress, milestones 🏗️, materials 🧱, and payments 💵`,
      subOptions: [
        { id: 'residential', text: '🏠 Residential Construction', response: 'Custom homes, villas, and apartments built to your specifications.' },
        { id: 'commercial', text: '🏢 Commercial Construction', response: 'Office buildings, shops, and commercial properties.' },
        { id: 'estimate', text: '💰 Cost Estimation', response: 'Get detailed construction cost estimates and quotes.' },
        { id: 'timeline', text: '⏱️ Project Timeline', response: 'View estimated timeline for project completion and milestones.' }
      ]
    },
    {
      id: 'orders',
      text: '📋 My Orders',
      response: `🔹 Manage all your property orders:  
→ Check status 📄  
→ Review contracts 💳  
→ Track delivery ⏰ & milestones 🏗️  
→ Update or cancel ✏️`,
      subOptions: [
        { id: 'rental', text: '🏠 Rental Orders', response: 'View and manage all your current and past rental orders.' },
        { id: 'purchase', text: '💰 Purchase Orders', response: 'Track your property purchases and contract details.' },
        { id: 'payment-status', text: '💳 Payment Status', response: 'Check if your payments are completed, pending, or refunded.' },
        { id: 'delivery', text: '📦 Delivery/Move-in', response: 'Track delivery or move-in schedule for rented or purchased properties.' }
      ]
    },
    {
      id: 'account',
      text: '👤 Account Help',
      response: `🔹 Manage your Destiny account:  
→ Update info 📝 & contact 📧  
→ Review order history 📜  
→ Wishlist 💖  
→ Notifications 🔔 & alerts ⚡  
→ Security 🔒`,
      subOptions: [
        { id: 'update', text: '✏️ Update Info', response: 'Update your profile, contact info, and preferences.' },
        { id: 'security', text: '🔒 Security Settings', response: 'Change password, enable 2FA, and manage account security.' },
        { id: 'notifications', text: '🔔 Notification Settings', response: 'Manage email/SMS/push notifications for updates and alerts.' },
        { id: 'helpdesk', text: '🆘 Customer Support', response: 'Contact support for any account or property-related issues.' }
      ]
    }
  ];

  const predefinedResponses: Record<string, string> = {
    hello: `Hello! Welcome to Destiny. I am your personal assistant.
I can guide you through browsing properties, renting or buying homes, construction services, 
order management, account support, and general queries. How may I assist you today?`,
    properties: quickOptions[0].response,
    rent: quickOptions[1].response,
    buy: quickOptions[2].response,
    construction: quickOptions[3].response,
    orders: quickOptions[4].response,
    help: `I can assist you with the following:
- Browsing properties
- Renting or purchasing homes
- Managing construction projects
- Viewing and managing your orders
- Updating account information
- Payment and pricing details`,
    contact: `To contact property sellers:
- Open the property details page.
- Find seller information including phone number or email.
- Reach out directly for inquiries or appointments.`,
    account: quickOptions[5].response,
    payment: `We accept multiple secure payment methods:
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Credit/Debit Cards
- Net Banking
All transactions are fully encrypted and protected for your security.`,
    pricing: `All property prices are displayed in Indian Rupees (₹):
- Rentals show monthly rental price.
- Sales show total property price.
- Prices include applicable taxes and charges.
- Detailed pricing info is available on each property page.`,
    default: `I am here to assist! Could you please specify your query? 
I can help with properties, rentals, purchases, construction services, orders, account management, or payments.`
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleSendMessage = (text?: string) => {
    const msg = text || inputMessage;
    if (!msg.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: msg, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setShowQuickOptions(false);
    setInputMessage('');
    setIsBotTyping(true);

    setTimeout(() => {
      const matchedOption = quickOptions.find(opt => msg.toLowerCase().includes(opt.id));
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: matchedOption ? matchedOption.response : predefinedResponses.default, sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
      setIsBotTyping(false);

      if (matchedOption?.subOptions) setSubOptionsToShow(matchedOption.subOptions);
      else setSubOptionsToShow([]);

      // Reset main quick options after 10 seconds
      // Do not reset quick options automatically
      setShowQuickOptions(false);

    }, 1000);
  };

  const handleQuickOptionClick = (option: QuickOption) => handleSendMessage(option.text);

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); };

  useEffect(() => { scrollToBottom(); if (isOpen) inputRef.current?.focus(); }, [messages, isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700"
        size="icon"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-40 w-[90%] max-w-[600px] md:w-[400px] lg:w-[500px] h-[80%] max-h-[700px] shadow-2xl border-0 bg-background/95 backdrop-blur-lg flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" /> Destiny Assistant
            </CardTitle>
          </CardHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && <Bot className="h-6 w-6 text-blue-600 mt-1" />}
                  <div className={`max-w-[70%] p-3 rounded-lg text-sm whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                    {msg.text}
                    <div className="text-[10px] text-gray-400 text-right mt-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {msg.sender === 'user' && <User className="h-6 w-6 text-gray-600 mt-1" />}
                </div>
              ))}

              {/* Show sub-options under last bot message */}
              {subOptionsToShow.length > 0 && (
                <div className="pl-10 space-y-2 mt-1">
                  {subOptionsToShow.map(opt => (
                    <Button key={opt.id} variant="outline" size="sm" className="text-left justify-start text-xs h-8 hover:scale-105" onClick={() => handleQuickOptionClick(opt)}>
                      {opt.text}
                    </Button>
                  ))}
                </div>
              )}

              {isBotTyping && (
                <div className="flex items-start gap-2">
                  <Bot className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="animate-pulse max-w-[50%] p-3 rounded-lg bg-muted text-sm">Typing...</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showQuickOptions && (
              <div className="p-2 space-y-1 bg-background/80 backdrop-blur-sm rounded-lg mx-2 my-1 flex-shrink-0">
                <p className="text-xs text-muted-foreground text-center">Quick options:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickOptions.map(opt => (
                    <Button key={opt.id} variant="outline" size="sm" className="text-left justify-start text-xs h-8 hover:scale-105" onClick={() => handleQuickOptionClick(opt)}>
                      {opt.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-2 border-t flex gap-2
flex-shrink-0">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage()} size="icon" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;