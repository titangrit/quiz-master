import { QuizLifecycleStatusCode } from "./constants";

export type QuizType = {
  ID?: number;
  QuizEventName?: string;
  StartDateTime?: Date;
  EndDateTime?: Date;
  LifecycleStatusCode?: QuizLifecycleStatusCode;
  NumberOfRounds?: number;
  NumberOfTeams?: number;
  CurrentRoundSeq?: number;
  CurrentQuestionSeq?: number;
};

export type TeamType = {
  UUID?: string;
  QuizID?: number;
  SequenceNumber?: number;
  TeamName?: string;
  Member1Name?: string;
  Member2Name?: string;
  Member3Name?: string;
  Member4Name?: string;
  TotalMark?: number;
};

export type RoundType = {
  UUID?: string;
  QuizID?: number;
  RoundName?: string;
  SequenceNumber?: number;
  NumQuestionsEachTeam?: number;
  FullMarkEachQuestion?: number;
  IsMCQ?: boolean;
  IsAudioVisualRound?: boolean;
  IsPassable?: boolean;
  TimerSeconds?: number;
};

export type QuestionType = {
  UUID?: string;
  RoundUUID?: string;
  SequenceNumber?: number;
  Description?: string;
  Option1?: string;
  Option2?: string;
  Option3?: string;
  Option4?: string;
  Answer?: string;
  MediaBase64?: string;
  TargetTeamUUID?: string;
  ActualTeamUUID?: string;
  ActualMarkGiven?: number;
  AnswerGiven?: string;
};

export interface IHandleDatabase {
  createQuiz: (quiz: QuizType) => Promise<number>;
  createTeam: (team: TeamType) => Promise<string>;
  createRound: (round: RoundType) => Promise<string>;
  createQuestion: (question: QuestionType) => Promise<string>;

  getQuiz: (quizID?: number) => Promise<QuizType[]>;
  getTeamsByQuizID: (quizID: number) => Promise<TeamType[]>;
  getTeamByUUID: (teamUUID: string) => Promise<TeamType>;
  getRoundsByQuizID: (quizID: number) => Promise<RoundType[]>;
  getRoundByUUID: (roundUUID: string) => Promise<RoundType>;
  getQuestionsByRoundUUID: (roundUUID: string) => Promise<QuestionType[]>;
  getQuestionByUUID: (questionUUID: string) => Promise<QuestionType>;

  updateQuiz: (quiz: QuizType) => Promise<void>;
  updateTeam: (team: TeamType) => Promise<void>;
  updateRound: (round: RoundType) => Promise<void>;
  updateQuestion: (question: QuestionType) => Promise<void>;

  deleteTeam: (teamUUID: string) => Promise<void>;
}
