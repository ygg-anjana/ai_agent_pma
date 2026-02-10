import React, { useState, useEffect } from 'react';
import { UserData } from '../types';
import { Terminal, ShieldCheck, ArrowRight, Lock, Link as LinkIcon } from 'lucide-react';

interface WelcomeStepProps {
  onStart: (data: UserData) => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [hasInvite, setHasInvite] = useState(false);

  useEffect(() => {
    // Check for "invite" query param to simulate a secure link scenario
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref') === 'secure_recruit') {
      setHasInvite(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Identity verification failed. All fields required.');
      return;
    }
    if (!email.includes('@')) { // Basic validation
      setError('Invalid work email format.');
      return;
    }
    onStart({ name, email });
  };

  const toggleInviteSimulation = () => {
    const nextState = !hasInvite;
    setHasInvite(nextState);
    
    // Update browser URL visually to match the state (for demo purposes)
    const url = new URL(window.location.href);
    if (nextState) {
      url.searchParams.set('ref', 'secure_recruit');
    } else {
      url.searchParams.delete('ref');
    }
    window.history.pushState({}, '', url);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass-panel rounded-2xl shadow-2xl border border-ygg-border relative overflow-hidden transition-all duration-500">
      
      {/* Decorative "Secure" banner if link is used */}
      <div className={`absolute top-0 left-0 w-full py-1 flex items-center justify-center gap-2 transition-all duration-500 ${hasInvite ? 'bg-ygg-accent/10 border-b border-ygg-accent/20 translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <Lock className="w-3 h-3 text-ygg-accent" />
        <span className="text-[10px] font-mono text-ygg-accent tracking-widest uppercase">Encrypted Invite Detected</span>
      </div>

      <div className={`flex flex-col items-center mb-8 text-center transition-all duration-500 ${hasInvite ? 'mt-8' : 'mt-4'}`}>
        <div className="w-16 h-16 bg-ygg-panel rounded-full flex items-center justify-center border border-ygg-border mb-4 relative group cursor-pointer" onClick={toggleInviteSimulation} title="Click to toggle Invite Mode (Dev)">
          <Terminal className="w-8 h-8 text-ygg-accent" />
          {/* Pulsing indicator - only active when invite is present */}
          {hasInvite && (
            <div className="absolute -inset-1 rounded-full border border-ygg-accent/30 animate-ping opacity-20"></div>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">YGG Gatekeeper</h1>
        <p className="text-gray-400 text-sm">
          Internal Community Access Control.<br/>
          Verify your knowledge to proceed.
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
          <span>Initialize Sequence</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-ygg-border flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure Connection</span>
        </div>
        
        {/* Helper for demo/testing */}
        <button 
          onClick={toggleInviteSimulation}
          className="flex items-center gap-1 hover:text-ygg-accent transition-colors opacity-50 hover:opacity-100"
          title="Simulate incoming web link"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{hasInvite ? "Clear Link" : "Test Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;