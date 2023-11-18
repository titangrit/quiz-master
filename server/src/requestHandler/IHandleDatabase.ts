import { type QuizLifeCycleStatusCode } from "./constants";

export type QuizType = {
  ID?: number;
  QuizEventName?: string;
  StartDateTime?: Date;
  EndDateTime?: Date;
  LifecycleStatusCode?: QuizLifeCycleStatusCode;
  NumberOfRounds?: number;
  NumberOfTeams?: number;
  CurrentRoundSeq?: number;
  CurrentQuestionSeq?: number;
  Team1UUID?: string;
  Team2UUID?: string;
  Team3UUID?: string;
  Team4UUID?: string;
};

export type MemberType = {
  UUID?: string;
  Surname?: string;
  Name?: string;
  Lastname?: string;
};

export type TeamType = {
  UUID?: string;
  TeamName?: string;
  Member1UUID?: string;
  Member2UUID?: string;
  Member3UUID?: string;
  Member4UUID?: string;
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
  createMember: (member: MemberType) => Promise<string>;
  createTeam: (team: TeamType) => Promise<string>;
  createRound: (round: RoundType) => Promise<string>;
  createQuestion: (question: QuestionType) => Promise<string>;

  getQuiz: (quizID?: number) => Promise<QuizType[]>;
  getMembersByTeamUUID: (teamUUID: string) => Promise<MemberType[]>;
  getMemberByUUID: (memberUUID: string) => Promise<MemberType>;
  getTeamsByQuizID: (quizID: number) => Promise<TeamType[]>;
  getTeamByUUID: (teamUUID: string) => Promise<TeamType>;
  getRoundsByQuizID: (quizID: number) => Promise<RoundType[]>;
  getRoundByUUID: (roundUUID: string) => Promise<RoundType>;
  getQuestionsByRoundUUID: (roundUUID: string) => Promise<QuestionType[]>;
  getQuestionByUUID: (questionUUID: string) => Promise<QuestionType>;

  updateQuiz: (quiz: QuizType) => Promise<void>;
  updateMember: (member: MemberType) => Promise<void>;
  updateTeam: (team: TeamType) => Promise<void>;
  updateRound: (round: RoundType) => Promise<void>;
  updateQuestion: (question: QuestionType) => Promise<void>;

  deleteMember: (memberUUID: string) => Promise<void>;
  deleteTeam: (teamUUID: string) => Promise<void>;
}
