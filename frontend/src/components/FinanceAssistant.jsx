import React, { useState } from 'react';

// You can use OpenRouter's free endpoint or HuggingFace's Inference API for demo purposes
// This example uses OpenRouter (https://openrouter.ai/docs#quickstart) which is free for small requests
// You need to get a free API key from https://openrouter.ai/

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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'; // Replace with your free key

const FinanceAssistant = ({ transactions }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about your finances or general finance questions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');

    // Intercept simple finance questions for brief, direct answers
    let response = '';
    if (/balance|current balance|net balance/i.test(input)) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpense;
      response = `₹${balance.toLocaleString()}`;
    } else if (/total income/i.test(input)) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      response = `₹${totalIncome.toLocaleString()}`;
    } else if (/total expense|total spent/i.test(input)) {
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      response = `₹${totalExpense.toLocaleString()}`;
    }
    if (response) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: response }]);
      return;
    }

    setLoading(true);
    // Prepare prompt: include user's question and a summary of their transactions
    const systemPrompt = `You are a helpful finance assistant. The user's transaction data is: ${JSON.stringify(transactions)}. Answer questions using this data if relevant, otherwise answer in 2-3 brief sentences, never more. Be concise and direct.`;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            userMsg
          ],
          max_tokens: 256
        })
      });
      const data = await res.json();
      let aiMsg = 'Sorry, I could not get an answer.';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        // Always keep answer to 2-3 sentences max
        aiMsg = data.choices[0].message.content.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');
      } else if (data.error && data.error.message) {
        aiMsg = `API Error: ${data.error.message}`;
      }
      setMessages(msgs => [...msgs, { role: 'assistant', content: aiMsg }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Error contacting AI API: ' + err.message }]);
    }
    setLoading(false);
  };

  return (
    <div className="finance-assistant-container" style={{maxWidth: 500, margin: '0 auto', padding: 24, background: '#f8f9fa', borderRadius: 12}}>
      <h2>💬 Finance Assistant</h2>
      <div className="chat-window" style={{minHeight: 200, marginBottom: 16, background: '#fff', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px #e0e0e0'}}>
        {messages.map((msg, i) => (
          <div key={i} style={{marginBottom: 8, textAlign: msg.role === 'user' ? 'right' : 'left'}}>
            <span style={{fontWeight: msg.role === 'user' ? 'bold' : 'normal'}}>{msg.role === 'user' ? 'You' : 'Assistant'}: </span>
            <span>{msg.content}</span>
          </div>
        ))}
        {loading && <div>Assistant: <em>Thinking...</em></div>}
      </div>
      <form onSubmit={handleSend} style={{display: 'flex', gap: 8}}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about your finances..."
          style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{padding: '8px 16px', borderRadius: 6, background: '#667eea', color: '#fff', border: 'none'}}>Send</button>
      </form>
      <div style={{fontSize: 12, color: '#888', marginTop: 8}}>
        Powered by OpenRouter (free). Get your API key at <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">openrouter.ai</a> and set it in the code.
      </div>
    </div>
  );
};

import Footer from './Footer';

const FinanceAssistantWithFooter = (props) => (
  <>
    <FinanceAssistant {...props} />
    <Footer />
  </>
);

export default FinanceAssistantWithFooter;
