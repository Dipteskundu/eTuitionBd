import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../../components/ui/Spinner';
import Input from '../../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
            // Poll for new messages every 5 seconds
            const interval = setInterval(() => fetchMessages(selectedConversation._id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const res = await axiosSecure.get('/my-conversations');
            setConversations(res.data || []);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await axiosSecure.get(`/messages/${conversationId}`);
            setMessages(res.data || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSendingMessage(true);
        try {
            await axiosSecure.post('/messages', {
                conversationId: selectedConversation._id,
                content: newMessage.trim()
            });
            setNewMessage('');
            await fetchMessages(selectedConversation._id);
            await fetchConversations(); // Update last message in list
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        if (today.toDateString() === msgDate.toDateString()) {
            return 'Today';
        }
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filteredConversations = conversations.filter(c =>
        c.otherParticipant?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.otherParticipant?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Spinner variant="dots" size="lg" fullScreen />;
    }

    return (
        <div className="h-[calc(100vh-200px)] min-h-[500px] flex rounded-xl overflow-hidden border border-base-200 bg-base-100 shadow-lg">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 border-r border-base-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-base-200">
                    <h2 className="text-xl font-bold mb-3">Messages</h2>
                    <Input
                        placeholder="Search conversations..."
                        leftIcon={<Search size={16} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-base-200/50"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <MessageCircle className="w-12 h-12 text-base-content/20 mb-4" />
                            <p className="text-base-content/60">No conversations yet</p>
                            <p className="text-sm text-base-content/40">Start a conversation from a tutor profile</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv._id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`w-full p-4 flex items-center gap-3 hover:bg-base-200/50 transition-colors border-b border-base-200/50 ${selectedConversation?._id === conv._id ? 'bg-primary/10' : ''
                                    }`}
                            >
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                                        <img
                                            src={conv.otherParticipant?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                            alt={conv.otherParticipant?.displayName}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <h3 className="font-semibold truncate">
                                        {conv.otherParticipant?.displayName || conv.otherParticipant?.email}
                                    </h3>
                                    <p className="text-sm text-base-content/60 truncate">
                                        {conv.lastMessage || 'No messages yet'}
                                    </p>
                                </div>
                                {conv.lastMessageAt && (
                                    <span className="text-xs text-base-content/40">
                                        {formatDate(conv.lastMessageAt)}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-base-200 flex items-center gap-3 bg-base-200/30">
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="btn btn-ghost btn-sm md:hidden"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full">
                                    <img
                                        src={selectedConversation.otherParticipant?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                        alt={selectedConversation.otherParticipant?.displayName}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">
                                    {selectedConversation.otherParticipant?.displayName || selectedConversation.otherParticipant?.email}
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    {selectedConversation.otherParticipant?.email}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/20">
                            <AnimatePresence>
                                {messages.map((msg, index) => {
                                    const isOwn = msg.senderEmail === user?.email;
                                    return (
                                        <motion.div
                                            key={msg._id || index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwn
                                                        ? 'bg-primary text-white rounded-br-sm'
                                                        : 'bg-base-100 border border-base-200 rounded-bl-sm'
                                                    }`}
                                            >
                                                <p className="break-words">{msg.content}</p>
                                                <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-base-content/50'}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t border-base-200 bg-base-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="input input-bordered flex-1"
                                    disabled={sendingMessage}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="btn btn-primary"
                                >
                                    {sendingMessage ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <MessageCircle className="w-20 h-20 text-base-content/10 mb-4" />
                        <h3 className="text-xl font-bold text-base-content/60 mb-2">
                            Select a conversation
                        </h3>
                        <p className="text-base-content/40 max-w-md">
                            Choose a conversation from the sidebar to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
