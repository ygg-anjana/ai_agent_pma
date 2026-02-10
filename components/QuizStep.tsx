import React, { useState, useEffect } from 'react';
import { Question, UserData } from '../types';
import { TIME_LIMIT_SECONDS } from '../constants';
import { Timer, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QuizStepProps {
  questions: Question[];
  onFinish: (answers: Record<string, number>) => void;
}

const QuizStep: React.FC<QuizStepProps> = ({ questions, onFinish }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(answers);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinish(answers);
    }
  };

  const isAnswered = answers[questions[currentQuestionIndex].id] !== undefined;
  const currentQ = questions[currentQuestionIndex];

  // Calculate progress percentage for the bar
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2 text-ygg-accent">
          <span className="font-mono text-sm">PROTOCOL: EXAM</span>
        </div>
        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          <Timer className="w-5 h-5" />
          <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-1 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-ygg-accent h-full transition-all duration-300 ease-out" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-ygg-border mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-semibold text-white leading-relaxed">
            <span className="text-ygg-accent font-mono mr-3">0{currentQuestionIndex + 1}.</span>
            {currentQ.text}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQ.id, idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center gap-3
                  ${isSelected 
                    ? 'bg-ygg-accent/20 border-ygg-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-black/30 border-ygg-border text-gray-400 hover:bg-white/5 hover:border-gray-500'
                  }
                `}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                  ${isSelected ? 'border-ygg-accent bg-ygg-accent' : 'border-gray-600'}
                `}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
            ${isAnswered 
              ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizStep;
