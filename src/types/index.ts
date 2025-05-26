export interface QuizDetails {
  name: string;
  heading: string;
  activities: Activity[];
}

export interface Activity {
  activity_name: string;
  order: number;
  questions: Question[];
}

export interface Question {
  is_correct?: boolean;
  stimulus?: string;
  order: number;
  user_answers?: any[];
  feedback?: string;
  round_title?: string;
  questions?: RoundQuestion[];
}

export interface RoundQuestion {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: any[];
  feedback: string;
}
