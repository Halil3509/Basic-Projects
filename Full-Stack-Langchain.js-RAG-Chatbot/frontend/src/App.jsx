import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const userMessage = { text: input, type: "human", sender: "user"};
            setMessages([...messages, userMessage]);
            setInput('');
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/api/chat', { message: input });
                console.log("Response:", response.data.result)
                const botMessage = { text: response.data.result, sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <h1>Chatbot</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>{msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form>
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default App;
