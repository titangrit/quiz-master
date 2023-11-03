import { QuizLifeCycleStatusCode } from "./constants";

export namespace CreateParam {
    export type QuizInstance = {
        QuizEventName: string,
        NumberOfRounds: number,
        NumberOfTeams: number
    };

    export type MemberInstance = {
        Surname: string,
        Name: string,
        Lastname: string
    };

    export type TeamInstance = {
        TeamName: string,
        Member1UUID: string,
        Member2UUID: string,
        Member3UUID: string,
        Member4UUID: string
    };

    export type RoundTypeInstance = {
        RoundTypeID: string,
        RoundTypeName: string,
        NumQuestionsEachTeam: number,
        FullMarkEachQuestion: number,
        IsMCQ: boolean,
        IsAVRound: boolean,
        IsPassable: boolean,
        TimerSeconds: number
    };

    export type RoundInstance = {
        QuizID: string,
        RoundTypeID: string,
        SequenceNumber: number
    };

    export type QuestionInstance = {
        RoundUUID: string,
        SequenceNumber: number,
        Description: string,
        Option1: string,
        Option2: string,
        Option3: string,
        Option4: string,
        Answer: string,
        MediaBase64: any
    };
}

export namespace UpdateParam {
    export type QuizInstance = {
        QuizEventName?: string,
        StartDate?: Date,
        EndDate?: Date,
        LifecycleStatusCode?: number,
        NumberOfRounds?: number,
        NumberOfTeams?: number,
        CurrentRoundSeq?: number,
        CurrentQuestionSeq?: number,
        Team1UUID?: string,
        Team2UUID?: string,
        Team3UUID?: string,
        Team4UUID?: string
    };

    export type MemberInstance = {
        UUID: string,
        Surname: string,
        Name: string,
        Lastname: string
    };

    export type TeamInstance = {
        UUID: string,
        TeamName: string
    };

    /**
     * Do not support, it will cause inconsistency to past quizzes
     */
    // export type RoundTypeInstance =  {
    //     RoundTypeID: string,
    //     RoundTypeName: string,
    //     NumQuestionsEachTeam: number,
    //     FullMarkEachQuestion: number,
    //     IsMCQ: boolean,
    //     IsAVRound: boolean,
    //     IsPassable: boolean,
    //     TimerSeconds: number
    // };

    export type RoundInstance = {
        RoundTypeID?: string,
        SequenceNumber?: number
    };

    export type QuestionInstance = {
        Description?: string,
        Option1?: string,
        Option2?: string,
        Option3?: string,
        Option4?: string,
        Answer?: string,
        MediaBase64?: any,
        TargetTeamUUID?: string,
        ActualTeamUUID?: string,
        ActualMarkGiven?: number,
        AnswerGiven?: string
    };
}

export namespace GetParam {
    export type RoundType = {
        RoundTypeID: string,
        RoundTypeName: string,
        NumQuestionsEachTeam: number,
        FullMarkEachQuestion: number,
        IsMCQ: boolean,
        IsAVRound: boolean,
        IsPassable: boolean,
        TimerSeconds: number
    };

    export type Round = {
        UUID: string,
        QuizID: number,
        RoundTypeID: string,
        SequenceNumber: number
    };

    export type Quiz = {
        QuizEventID: number,
        QuizEventname: string,
        StartDateTime: Date,
        EndDateTime: Date,
        LifeycleStatusCode: QuizLifeCycleStatusCode,
        NumberOfRounds: number,
        NumberOfTeams: number,
        CurrentRoundSeq: number,
        CurrentQuestionSeq: number,
        Team1UUID?: string,
        Team2UUID?: string,
        Team3UUID?: string,
        Team4UUID?: string
    }

    export type Member = {
        UUID: string,
        Surname: string,
        Name: string,
        Lastname: string
    }

    export type Team = {
        UUID: string,
        TeamName: string,
        Member1: Member,
        Member2: Member,
        Member3: Member,
        Member4: Member
    }

    export type Question = {
        UUID: string,
        SequenceNumber: number,
        Description: string,
        Option1: string,
        Option2: string,
        Option3: string,
        Option4: string,
        Answer: string,
        RoundUUID: string,
        MediaBase64: any,
        TargetTeamUUID: string,
        ActualTeamUUID: string,
        AnswerGiven: string,
        ActualMarkGiven: number
    }
}

export interface IHandleDatabase {
    createQuizInstance(param: CreateParam.QuizInstance): Promise<number>;
    createMemberInstance(param: CreateParam.MemberInstance): Promise<string>;
    createTeamInstance(param: CreateParam.TeamInstance): Promise<string>;
    createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string>;
    createRoundInstance(param: CreateParam.RoundInstance): Promise<string>;
    createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string>;

    updateQuizInstance(quizID: number, param: UpdateParam.QuizInstance): Promise<void>;
    updateMemberInstance(param: UpdateParam.MemberInstance): Promise<void>;
    updateTeamInstance(param: UpdateParam.TeamInstance): Promise<void>;
    // Do not support, it will cause inconsistency to past quizzes
    //  updateRoundTypeInstance(param: updateRoundTypeInstanceParam): Promise<void>;
    updateRoundInstance(roundUUID: string, param: UpdateParam.RoundInstance): Promise<void>;
    updateQuestionInstance(questionUUID: string, param: UpdateParam.QuestionInstance): Promise<void>;

    getRoundTypes(): Promise<GetParam.RoundType[]>;
    getRoundTypeByID(roundTypeID: string): Promise<GetParam.RoundType>;
    getRoundsByQuizID(quizID: number): Promise<GetParam.Round[]>;
    getQuizByID(quizID: number): Promise<GetParam.Quiz>;
    getAllQuizzes(): Promise<GetParam.Quiz[]>;
    getTeamByUUID(teamUUID: string): Promise<GetParam.Team>;
    getQuestionsByRoundUUID(roundUUID: string): Promise<GetParam.Question[]>;
    getRoundByUUID(roundUUID: string): Promise<GetParam.Round>

    deleteMemberInstance(memberUUID: string): Promise<void>;
    deleteTeamInstance(teamUUID: string): Promise<void>;
}
