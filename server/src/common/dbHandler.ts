import { QuizLifeCycleStatusCode } from "./constants";

export namespace CreateParam {
    interface CreateQuizInstanceParam {
        QuizEventName: string,
        NumberOfRounds: number,
        NumberOfTeams: number
    };

    interface CreateMemberInstanceParam {
        Surname: string,
        Name: string,
        Lastname: string
    };

    interface CreateTeamInstanceParam {
        TeamName: string,
        Member1UUID: string,
        Member2UUID: string,
        Member3UUID: string,
        Member4UUID: string
    };

    interface CreateRoundTypeInstanceParam {
        RoundTypeID: string,
        RoundTypeName: string,
        NumQuestionsEachTeam: number,
        FullMarkEachQuestion: number,
        IsMCQ: boolean,
        IsAVRound: boolean,
        IsPassable: boolean,
        TimerSeconds: number
    };

    interface CreateRoundInstanceParam {
        QuizID: string,
        RoundTypeID: string,
        SequenceNumber: number
    };

    interface CreateQuestionInstanceParam {
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

    export type QuizInstance = CreateQuizInstanceParam;
    export type MemberInstance = CreateMemberInstanceParam;
    export type TeamInstance = CreateTeamInstanceParam;
    export type RoundTypeInstance = CreateRoundTypeInstanceParam;
    export type RoundInstance = CreateRoundInstanceParam;
    export type QuestionInstance = CreateQuestionInstanceParam;
}

export namespace UpdateParam {
    interface updateQuizInstanceParam {
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

    interface updateMemberInstanceParam {
        UUID: string,
        Surname: string,
        Name: string,
        Lastname: string
    };

    interface updateTeamInstanceParam {
        UUID: string,
        TeamName: string
    };

    /**
     * Do not support, it will cause inconsistency to past quizzes
     */
    // interface updateRoundTypeInstanceParam {
    //     RoundTypeID: string,
    //     RoundTypeName: string,
    //     NumQuestionsEachTeam: number,
    //     FullMarkEachQuestion: number,
    //     IsMCQ: boolean,
    //     IsAVRound: boolean,
    //     IsPassable: boolean,
    //     TimerSeconds: number
    // };

    interface updateRoundInstanceParam {
        RoundTypeID?: string,
        SequenceNumber?: number
    };

    interface updateQuestionInstanceParam {
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

    export type QuizInstance = updateQuizInstanceParam;
    export type MemberInstance = updateMemberInstanceParam;
    export type TeamInstance = updateTeamInstanceParam;
    // export type RoundTypeInstance = updateRoundTypeInstanceParam;
    export type RoundInstance = updateRoundInstanceParam;
    export type QuestionInstance = updateQuestionInstanceParam;
}

export namespace GetParam {
    interface getRoundTypeResponseParam {
        RoundTypeID: string,
        RoundTypeName: string,
        NumQuestionsEachTeam: number,
        FullMarkEachQuestion: number,
        IsMCQ: boolean,
        IsAVRound: boolean,
        IsPassable: boolean,
        TimerSeconds: number
    };

    interface getRoundResponseParam {
        UUID: string,
        QuizID: number,
        RoundTypeID: string,
        SequenceNumber: number
    };

    interface getQuizResponseParam {
        QuizEventID: number,
        QuizEventname: string,
        StartDateTime: Date,
        EndDateTime: Date,
        LifeycleStatusCode: QuizLifeCycleStatusCode,
        NumberOfRounds: number,
        NumberOfTeams: number,
        CurrentRoundSeq: number,
        CurrentQuestionSeq?: number,
        Team1UUID?: string,
        Team2UUID?: string,
        Team3UUID?: string,
        Team4UUID?: string
    }

    interface member {
        UUID: string,
        Surname: string,
        Name: string,
        Lastname: string
    }

    interface getTeamResponseParam {
        UUID: string,
        TeamName: string,
        Member1: member,
        Member2: member,
        Member3: member,
        Member4: member
    }

    interface getQuestionResponseParam {
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

    export type RoundType = getRoundTypeResponseParam;
    export type Round = getRoundResponseParam;
    export type Quiz = getQuizResponseParam;
    export type Member = member;
    export type Team = getTeamResponseParam;
    export type Question = getQuestionResponseParam;
}

export abstract class DbHandler {
    abstract createQuizInstance(param: CreateParam.QuizInstance): Promise<number>;
    abstract createMemberInstance(param: CreateParam.MemberInstance): Promise<string>;
    abstract createTeamInstance(param: CreateParam.TeamInstance): Promise<string>;
    abstract createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string>;
    abstract createRoundInstance(param: CreateParam.RoundInstance): Promise<string>;
    abstract createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string>;

    abstract updateQuizInstance(quizID: number, param: UpdateParam.QuizInstance): Promise<void>;
    abstract updateMemberInstance(param: UpdateParam.MemberInstance): Promise<void>;
    abstract updateTeamInstance(param: UpdateParam.TeamInstance): Promise<void>;
    // Do not support, it will cause inconsistency to past quizzes
    // abstract updateRoundTypeInstance(param: updateRoundTypeInstanceParam): Promise<void>;
    abstract updateRoundInstance(roundUUID: string, param: UpdateParam.RoundInstance): Promise<void>;
    abstract updateQuestionInstance(questionUUID: string, param: UpdateParam.QuestionInstance): Promise<void>;

    abstract getRoundTypes(): Promise<GetParam.RoundType[]>;
    abstract getRoundTypeByID(roundTypeID: string): Promise<GetParam.RoundType>;
    abstract getRoundsByQuizID(quizID: number): Promise<GetParam.Round[]>;
    abstract getQuizByID(quizID: number): Promise<GetParam.Quiz>;
    abstract getAllQuizzes(): Promise<GetParam.Quiz[]>;
    abstract getTeamByUUID(teamUUID: string): Promise<GetParam.Team>;
    abstract getQuestionsByRoundUUID(roundUUID: string): Promise<GetParam.Question[]>;
    abstract getRoundByUUID(roundUUID: string): Promise<GetParam.Round>

    abstract deleteMemberInstance(memberUUID: string): Promise<void>;
    abstract deleteTeamInstance(teamUUID: string): Promise<void>;

}
