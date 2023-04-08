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
        MediaUUID: string
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
        QuizID: string,
        QuizEventName: string,
        NumberOfRounds: number,
        NumberOfTeams: number
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
        UUID: string,
        SequenceNumber: number
    };

    interface updateQuestionInstanceParam {
        UUID: string,
        Description: string,
        Option1: string,
        Option2: string,
        Option3: string,
        Option4: string,
        Answer: string,
        MediaUUID: string
    };

    export type QuizInstance = updateQuizInstanceParam;
    export type MemberInstance = updateMemberInstanceParam;
    export type TeamInstance = updateTeamInstanceParam;
    // export type RoundTypeInstance = updateRoundTypeInstanceParam;
    export type RoundInstance = updateRoundInstanceParam;
    export type QuestionInstance = updateQuestionInstanceParam;
}

export abstract class DbHandler {
    abstract createQuizInstance(param: CreateParam.QuizInstance): Promise<number>;
    abstract createMemberInstance(param: CreateParam.MemberInstance): Promise<string>;
    abstract createTeamInstance(param: CreateParam.TeamInstance): Promise<string>;
    abstract createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string>;
    abstract createRoundInstance(param: CreateParam.RoundInstance): Promise<string>;
    abstract createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string>;

    abstract updateQuizInstance(param: UpdateParam.QuizInstance): Promise<void>;
    abstract updateMemberInstance(param: UpdateParam.MemberInstance): Promise<void>;
    abstract updateTeamInstance(param: UpdateParam.TeamInstance): Promise<void>;
    // Do not support, it will cause inconsistency to past quizzes
    // abstract updateRoundTypeInstance(param: updateRoundTypeInstanceParam): Promise<void>;
    abstract updateRoundInstance(param: UpdateParam.RoundInstance): Promise<void>;
    abstract updateQuestionInstance(param: UpdateParam.QuestionInstance): Promise<void>;

}
