import { QuizLifeCycleStatusCode } from "./constants"

export namespace ViewQuizData {
    export interface Member {
        Surname: string,
        Name: string,
        Lastname: string
    }

    export interface Team {
        TeamName: string,
        Member1: Member,
        Member2: Member,
        Member3: Member,
        Member4: Member
    }

    export interface Question {
        SequenceNumber: number,
        Description: string,
        Option1: string,
        Option2: string,
        Option3: string,
        Option4: string,
        CorrectOption: string,
        Answer: string
    }

    export interface Round {
        RoundTypeID: string,
        RoundTypeName: string,
        SequenceNumber: number,
        NumQuestionsEachTeam: number,
        FullMarkEachQuestion: number,
        TimerSeconds: number,
        IsMCQ: boolean,
        IsPassable: boolean,
        IsAVRound: boolean,
        Questions: Question[]
    }

    export interface Quiz {
        QuizID: number,
        QuizEventName: string,
        LifecycleStatusCode: QuizLifeCycleStatusCode,
        NumberOfTeams: number,
        NumberOfRounds: number,
        Teams: Team[],
        Rounds: Round[]
    }
}

export namespace GetAllQuizzes {
    export interface Quiz {
        QuizID: number,
        QuizEventName: string,
        LifecycleStatusCode: QuizLifeCycleStatusCode,
        CompletedOnDate: string
    }

    export type Quizzes = Quiz[];
}

export type QuizBasicInfo = {
    QuizEventID: number,
    QuizEventName: string,
    NumberOfTeams: number,
    NumberOfRounds: number
}

export namespace QuizTeamsDetail {
    export type Member = {
        Surname: string,
        Name: string,
        LastName: string
    }

    export type Team = {
        TeamName: string,
        Members: [Member, Member, Member, Member]
    }

    export type Teams = [Team, Team, Team, Team]
}