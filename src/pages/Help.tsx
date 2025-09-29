import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Shield,
  Users,
  Home as HomeIcon,
  Building,
  Hammer,
  Search,
  FileText,
  CreditCard,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '@/components/Chatbot';

const Help = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I search for properties?",
      answer: "Use our advanced search bar on the homepage or properties page. Filter by location, price range, property type, and more to find your perfect match.",
      category: "Properties"
    },
    {
      question: "What is the rental process?",
      answer: "Browse rental properties, click 'Rent Now', fill out the rental contract, complete payment and ID verification, then get your keys and move in!",
      category: "Rentals"
    },
    {
      question: "How do I purchase a property?",
      answer: "Browse our sales listings, click 'Buy Now', complete the purchase contract, provide ID verification and payment details, then sign the digital contract.",
      category: "Purchase"
    },
    {
      question: "What construction services do you offer?",
      answer: "We offer custom construction services including home building, renovations, and interior design with certified contractors and designers.",
      category: "Construction"
    },
    {
      question: "How can I track my orders?",
      answer: "Visit your Orders page to view all property orders, contract details, payment status, and property information.",
      category: "Orders"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Credit/Debit Cards, and Net Banking. All payments are processed securely with full encryption.",
      category: "Payment"
    }
  ];

  const helpCategories = [
    {
      icon: HomeIcon,
      title: "Property Search",
      description: "Finding and browsing properties",
      topics: ["Search filters", "Property details", "Virtual tours", "Location maps"]
    },
    {
      icon: FileText,
      title: "Contracts & Legal",
      description: "Rental and purchase agreements",
      topics: ["Digital contracts", "Legal documentation", "Terms & conditions", "Dispute resolution"]
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment methods and invoices",
      topics: ["Payment options", "Invoice download", "Refund policy", "Transaction history"]
    },
    {
      icon: Hammer,
      title: "Construction Services",
      description: "Custom building and design",
      topics: ["Project requests", "Timeline tracking", "Cost estimation", "Quality assurance"]
    },
    {
      icon: Settings,
      title: "Account Management",
      description: "Profile and account settings",
      topics: ["Profile updates", "Password reset", "Notification preferences", "Privacy settings"]
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Platform security and verification",
      topics: ["ID verification", "Secure transactions", "Privacy protection", "Report issues"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">Help Center</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-gray-300 mb-8">
            Find answers to common questions or chat with our AI assistant for instant help
          </p>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Browse Help Topics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-black rounded-lg">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-black">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.topics.map((topic, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-black pr-4">{faq.question}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Still Need Help?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Our support team is here to help you with any questions or concerns
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-300 text-sm">Chat with our AI assistant 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-300 text-sm">support@destiny.com</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-full inline-flex mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-300 text-sm">+91 1800-123-4567</p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/')} 
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Back to Home
          </Button>
        </div>
      </section>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Help;