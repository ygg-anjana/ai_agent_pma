export interface UserData {
  name: string;
  email: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizResult {
  passed: boolean;
  score: number;
  total: number;
  payload: PassPayload | FailPayload;
  transmissionLog?: string;
  transmissionSuccess?: boolean;
}

export interface PassPayload {
  result: "pass";
  name: string;
  email: string;
  score: number;
  timestamp: string;
}

export interface FailPayload {
  result: "fail";
  score: number;
}

export enum AppStep {
  WELCOME = 'WELCOME',
  LOADING_QUIZ = 'LOADING_QUIZ',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
}