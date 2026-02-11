import React, { useState } from 'react';
import { UserData } from '../types';
import { Terminal, ShieldCheck, ArrowRight, Hash } from 'lucide-react';

interface WelcomeStepProps {
  onStart: (data: UserData) => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Identity verification failed. All fields required.');
      return;
    }
    
    // Enforce corporate domain restriction
    if (!email.toLowerCase().endsWith('@yougotagift.com')) { 
      setError('Access Restricted. Only @yougotagift.com emails are authorized.');
      return;
    }
    
    onStart({ name, email });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass-panel rounded-2xl shadow-2xl border border-ygg-border relative overflow-hidden">
      
      <div className="flex flex-col items-center mb-8 text-center mt-4">
        <div className="w-16 h-16 bg-ygg-panel rounded-full flex items-center justify-center border border-ygg-border mb-4 relative">
          <Terminal className="w-8 h-8 text-ygg-accent" />
          <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full border border-gray-500">
            <Hash className="w-3 h-3" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">YGG AI Community</h1>
        <p className="text-gray-400 text-sm">
          <strong>Slack Access Gatekeeper</strong><br/>
          Verify your identity and pass the assessment to receive an invitation to the internal AI channel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs font-mono text-ygg-accent uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/50 border border-ygg-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-ygg-accent transition-all placeholder-gray-600"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-ygg-accent uppercase tracking-wider mb-2">
            Work Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-ygg-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-ygg-accent transition-all placeholder-gray-600"
            placeholder="jane@yougotagift.com"
          />
        </div>

        {error && (
          <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
            [ERROR] {error}
          </div>
        )}

        <button
          type="submit"
          className="group w-full bg-ygg-accent hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-ygg-border flex items-center justify-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>YGG Internal Systems</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;