import { type QuizLifeCycleStatusCode } from "./constants";

export type CreateQuizType = {
  QuizEventName: string;
  NumberOfRounds: number;
  NumberOfTeams: number;
  LifecycleStatusCode: number;
};

export type CreateMemberType = {
  Surname: string;
  Name: string;
  Lastname: string;
};

export type CreateTeamType = {
  TeamName: string;
  Member1UUID?: string;
  Member2UUID?: string;
  Member3UUID?: string;
  Member4UUID?: string;
};

export type CreateRoundType = {
  QuizID: string;
  RoundName: string;
  SequenceNumber: number;
  NumQuestionsEachTeam: number;
  FullMarkEachQuestion: number;
  IsMCQ?: boolean;
  IsAudioVisualRound?: boolean;
  IsPassable?: boolean;
  TimerSeconds?: number;
};

export type CreateQuestionType = {
  RoundUUID: string;
  SequenceNumber: number;
  Description: string;
  Option1?: string;
  Option2?: string;
  Option3?: string;
  Option4?: string;
  Answer: string;
  MediaBase64?: string;
};

export type UpdateQuizType = {
  ID: number;
  QuizEventName?: string;
  StartDateTime?: Date;
  EndDateTime?: Date;
  LifecycleStatusCode?: number;
  NumberOfRounds?: number;
  NumberOfTeams?: number;
  CurrentRoundSeq?: number;
  CurrentQuestionSeq?: number;
  Team1UUID?: string;
  Team2UUID?: string;
  Team3UUID?: string;
  Team4UUID?: string;
};

export type UpdateMemberType = {
  UUID: string;
  Surname?: string;
  Name?: string;
  Lastname?: string;
};

export type UpdateTeamType = {
  UUID: string;
  TeamName: string;
};

export type UpdateRoundType = {
  UUID: string;
  RoundName?: string;
  SequenceNumber?: number;
  NumQuestionsEachTeam?: number;
  FullMarkEachQuestion?: number;
  IsMCQ?: boolean;
  IsAudioVisualRound?: boolean;
  IsPassable?: boolean;
  TimerSeconds?: number;
};

export type UpdateQuestionType = {
  UUID: string;
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

export type GetQuizType = {
  ID: number;
  QuizEventName: string;
  StartDateTime: Date;
  EndDateTime: Date;
  LifecycleStatusCode: QuizLifeCycleStatusCode;
  NumberOfRounds: number;
  NumberOfTeams: number;
  CurrentRoundSeq: number;
  CurrentQuestionSeq: number;
  Team1UUID: string;
  Team2UUID: string;
  Team3UUID: string;
  Team4UUID: string;
};

export type GetMemberType = {
  UUID: string;
  Surname: string;
  Name: string;
  Lastname: string;
};

export type GetTeamType = {
  UUID: string;
  TeamName: string;
  Member1: GetMemberType;
  Member2: GetMemberType;
  Member3: GetMemberType;
  Member4: GetMemberType;
};

export type GetRoundType = {
  UUID: string;
  QuizID: number;
  RoundName: string;
  SequenceNumber: number;
  NumQuestionsEachTeam: number;
  FullMarkEachQuestion: number;
  IsMCQ: boolean;
  IsAudioVisualRound: boolean;
  IsPassable: boolean;
  TimerSeconds: number;
};

export type GetQuestionType = {
  UUID: string;
  SequenceNumber: number;
  Description: string;
  Option1: string;
  Option2: string;
  Option3: string;
  Option4: string;
  Answer: string;
  RoundUUID: string;
  MediaBase64: string;
  TargetTeamUUID: string;
  ActualTeamUUID: string;
  AnswerGiven: string;
  ActualMarkGiven: number;
};

export interface IHandleDatabase {
  createQuiz: (quiz: CreateQuizType) => Promise<number>;
  createMember: (member: CreateMemberType) => Promise<string>;
  createTeam: (team: CreateTeamType) => Promise<string>;
  createRound: (round: CreateRoundType) => Promise<string>;
  createQuestion: (question: CreateQuestionType) => Promise<string>;

  getQuiz: (quizID?: number) => Promise<GetQuizType[]>;
  getTeamsByQuizID: (quizID: number) => Promise<GetTeamType[]>;
  getTeamByUUID: (teamUUID: string) => Promise<GetTeamType>;
  getRoundsByQuizID: (quizID: number) => Promise<GetRoundType[]>;
  getRoundByUUID: (roundUUID: string) => Promise<GetRoundType>;
  getQuestionsByRoundUUID: (roundUUID: string) => Promise<GetQuestionType[]>;
  getQuestionByUUID: (questionUUID: string) => Promise<GetQuestionType>;

  updateQuiz: (quiz: UpdateQuizType) => Promise<void>;
  updateMember: (member: UpdateMemberType) => Promise<void>;
  updateTeam: (team: UpdateTeamType) => Promise<void>;
  updateRound: (round: UpdateRoundType) => Promise<void>;
  updateQuestion: (question: UpdateQuestionType) => Promise<void>;

  deleteMember: (memberUUID: string) => Promise<void>;
  deleteTeam: (teamUUID: string) => Promise<void>;
}
