import React, { useState } from 'react';
import WelcomeStep from './components/WelcomeStep';
import QuizStep from './components/QuizStep';
import ResultStep from './components/ResultStep';
import { generateQuestions } from './services/geminiService';
import { sendResultToSlack } from './services/slackService';
import { UserData, AppStep, Question, QuizResult, PassPayload, FailPayload } from './types';
import { Loader2, Send } from 'lucide-react';
import { PASSING_SCORE, TOTAL_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleStart = async (data: UserData) => {
    setUserData(data);
    setStep(AppStep.LOADING_QUIZ);
    
    try {
        const generatedQuestions = await generateQuestions();
        setQuestions(generatedQuestions);
        setStep(AppStep.QUIZ);
    } catch (e) {
        console.error("Critical failure during question generation", e);
        // Fallback is handled in service, but if that fails, we stay in loading or error state
    }
  };

  const handleFinishQuiz = async (answers: Record<string, number>) => {
    if (!userData) return;

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    const passed = score >= PASSING_SCORE;

    const payload: PassPayload | FailPayload = passed
      ? {
          result: "pass",
          name: userData.name,
          email: userData.email,
          score,
          timestamp: new Date().toISOString(),
        }
      : {
          result: "fail",
          score,
        };

    let transmissionLog = "";
    let transmissionSuccess: boolean | undefined = undefined;

    if (passed) {
      setIsTransmitting(true);
      try {
        const { status } = await sendResultToSlack(payload as PassPayload);
        
        // Status 0 comes from 'no-cors' mode which is an opaque success
        if (status === 0 || (status >= 200 && status < 300)) {
          transmissionLog = `✅ Payload transmitted to HQ.`;
          transmissionSuccess = true;
        } else {
          throw new Error(`HTTP ${status}`);
        }
      } catch (err: any) {
        console.error("Transmission failed", err);
        transmissionLog = "❌ Transmission error: " + (err.message || "Unknown error");
        transmissionSuccess = false;
      } finally {
        setIsTransmitting(false);
      }
    }

    // Prepare result state
    const resultState: QuizResult = {
      passed,
      score,
      total: questions.length,
      payload,
      transmissionLog,
      transmissionSuccess
    };

    setQuizResult(resultState);
    setStep(AppStep.RESULT);
  };

  const handleRetry = () => {
    setStep(AppStep.WELCOME);
    setUserData(null);
    setQuestions([]);
    setQuizResult(null);
  };

  return (
    <div className="min-h-screen bg-ygg-dark text-gray-200 font-sans selection:bg-ygg-accent selection:text-white flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 blur-3xl rounded-full" />
      </div>

      <main className="flex-grow flex items-center justify-center relative z-10 p-4">
        {step === AppStep.WELCOME && (
          <WelcomeStep onStart={handleStart} />
        )}

        {step === AppStep.LOADING_QUIZ && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 text-ygg-accent animate-spin mb-4" />
            <p className="font-mono text-sm text-ygg-accent">GENERATING_ASSESSMENT_VECTORS...</p>
          </div>
        )}

        {step === AppStep.QUIZ && !isTransmitting && (
          <QuizStep questions={questions} onFinish={handleFinishQuiz} />
        )}

        {isTransmitting && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full border-2 border-ygg-accent border-t-transparent animate-spin mb-6" />
            <div className="flex items-center gap-2 text-ygg-accent font-mono">
              <Send className="w-4 h-4" />
              <span>TRANSMITTING_TO_HQ...</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 font-mono">Encrypting Payload via TLS 1.3</div>
          </div>
        )}

        {step === AppStep.RESULT && quizResult && (
          <ResultStep result={quizResult} onRetry={handleRetry} />
        )}
      </main>

      <footer className="relative z-10 p-4 text-center text-xs text-gray-600 font-mono">
        YGG_INTERNAL_SYSTEMS // v2.4.2 // SECURE_MODE
      </footer>
    </div>
  );
};

export default App;