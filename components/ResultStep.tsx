import React, { useState } from 'react';
import { QuizResult } from '../types';
import { CheckCircle, XCircle, Copy, Terminal, Check, AlertTriangle, CloudLightning, Slack } from 'lucide-react';

interface ResultStepProps {
  result: QuizResult;
  onRetry: () => void;
}

const ResultStep: React.FC<ResultStepProps> = ({ result, onRetry }) => {
  const isPass = result.passed;
  const [copiedJson, setCopiedJson] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      
      {/* Header Banner */}
      <div className={`w-full p-1 rounded-t-2xl bg-gradient-to-r ${isPass ? 'from-green-500 via-emerald-500 to-green-500' : 'from-red-500 via-orange-500 to-red-500'}`} />
      
      <div className="glass-panel p-8 rounded-b-2xl shadow-2xl border-x border-b border-ygg-border">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          {isPass ? (
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/50">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isPass ? "ACCESS GRANTED" : "ACCESS DENIED"}
          </h2>
          <p className={`text-lg font-mono ${isPass ? 'text-green-400' : 'text-red-400'}`}>
            Score: {result.score} / {result.total}
          </p>
          <p className="text-gray-500 text-sm mt-2 max-w-sm">
            {isPass 
              ? "Congratulations! Your credentials have been verified. An invitation to the Slack channel has been dispatched." 
              : "Knowledge baseline not met. Please study the materials and re-apply."}
          </p>
        </div>

        {/* Transmission Log Status */}
        {result.transmissionLog && (
          <div className={`mb-6 p-3 rounded-lg flex items-center gap-3 border ${result.transmissionSuccess ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
            {result.transmissionSuccess ? <Slack className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="font-mono text-sm">{result.transmissionLog}</span>
          </div>
        )}

        {/* JSON Output Block */}
        <div className="relative group mb-8">
          <div className="absolute -top-3 left-4 bg-ygg-panel px-2 text-xs font-mono text-gray-400 flex items-center gap-1 border border-ygg-border rounded">
            <Terminal className="w-3 h-3" />
            <span>OUTPUT_PAYLOAD.JSON</span>
          </div>
          <div className="bg-black/80 rounded-lg border border-ygg-border p-6 overflow-x-auto font-mono text-sm shadow-inner relative">
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
              title="Copy JSON"
            >
              {copiedJson ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className={isPass ? "text-green-300" : "text-red-300"}>
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRetry}
            className="text-sm text-gray-500 hover:text-white underline decoration-gray-700 hover:decoration-white underline-offset-4 transition-all"
          >
            {isPass ? "Start New Assessment" : "Restart Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultStep;