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

interface CreateRountTypeInstanceParam {

};

interface CreateRoundInstanceParam {
    QuizID: string,
    RoundTypeID: string,
    SequenceNumber: number
};

interface CreateQuestionInstanceParam {

};

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
    TeamName: string,
    Member1UUID: string,
    Member2UUID: string,
    Member3UUID: string,
    Member4UUID: string
};

interface updateRountTypeInstanceParam {

};

interface updateRoundInstanceParam {
    UUID: string,
    QuizID: string,
    RoundTypeID: string,
    SequenceNumber: number
};

interface updateQuestionInstanceParam {

};

abstract class DbHandler {
    constructor(protected port: string, protected user: string, protected pass: string) { }

    abstract createQuizInstance(param: CreateQuizInstanceParam): string;
    abstract createMemberInstance(param: CreateMemberInstanceParam): string;
    abstract createTeamInstance(param: CreateTeamInstanceParam): string;
    abstract createRoundTypeInstance(param: CreateRountTypeInstanceParam): string;
    abstract createRoundInstance(param: CreateRoundInstanceParam): string;
    abstract createQuestionInstance(param: CreateQuestionInstanceParam): string;

    abstract updateQuizInstance(param: updateQuizInstanceParam): string;
    abstract updateMemberInstance(param: updateMemberInstanceParam): string;
    abstract updateTeamInstance(param: updateTeamInstanceParam): string;
    abstract updateRoundTypeInstance(param: updateRountTypeInstanceParam): string;
    abstract updateRoundInstance(param: updateRoundInstanceParam): string;
    abstract updateQuestionInstance(param: updateQuestionInstanceParam): string;

}

export type {
    CreateQuizInstanceParam,
    CreateMemberInstanceParam,
    CreateTeamInstanceParam,
    CreateRountTypeInstanceParam,
    CreateRoundInstanceParam,
    CreateQuestionInstanceParam
};

export { DbHandler }