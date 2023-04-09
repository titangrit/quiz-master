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

    interface AssociateTeamsToQuizParam {
        QuizID: number,
        Team1UUID: string,
        Team2UUID: string,
        Team3UUID: string,
        Team4UUID: string
    };

    export type QuizInstance = CreateQuizInstanceParam;
    export type MemberInstance = CreateMemberInstanceParam;
    export type TeamInstance = CreateTeamInstanceParam;
    export type RoundTypeInstance = CreateRoundTypeInstanceParam;
    export type RoundInstance = CreateRoundInstanceParam;
    export type QuestionInstance = CreateQuestionInstanceParam;
    export type AssociateTeamsToQuiz = AssociateTeamsToQuizParam;
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

export namespace GetResponseParam {
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
        RoundTypeID: string,
        SequenceNumber: number
    };

    export type RoundType = getRoundTypeResponseParam;
    export type Round = getRoundResponseParam;
}

export abstract class DbHandler {
    abstract createQuizInstance(param: CreateParam.QuizInstance): Promise<number>;
    abstract createMemberInstance(param: CreateParam.MemberInstance): Promise<string>;
    abstract createTeamInstance(param: CreateParam.TeamInstance): Promise<string>;
    abstract createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string>;
    abstract createRoundInstance(param: CreateParam.RoundInstance): Promise<string>;
    abstract createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string>;

    abstract associateTeamsToQuiz(param: CreateParam.AssociateTeamsToQuiz): Promise<void>;

    abstract updateQuizInstance(param: UpdateParam.QuizInstance): Promise<void>;
    abstract updateMemberInstance(param: UpdateParam.MemberInstance): Promise<void>;
    abstract updateTeamInstance(param: UpdateParam.TeamInstance): Promise<void>;
    // Do not support, it will cause inconsistency to past quizzes
    // abstract updateRoundTypeInstance(param: updateRoundTypeInstanceParam): Promise<void>;
    abstract updateRoundInstance(param: UpdateParam.RoundInstance): Promise<void>;
    abstract updateQuestionInstance(param: UpdateParam.QuestionInstance): Promise<void>;

    abstract getRoundTypes(): Promise<GetResponseParam.RoundType[]>;
    abstract getRoundTypeByID(roundTypeID: string): Promise<GetResponseParam.RoundType>;
    abstract getRoundsByQuizID(quizID: number): Promise<GetResponseParam.Round[]>;

}
