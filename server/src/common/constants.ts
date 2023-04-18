export enum QuizLifeCycleStatusCode {
    Draft = 1,
    Ready = 2,
    Running = 3,
    Completed = 4
}

export namespace QuizMasterSchema {
    export enum Quiz {
        QuizID = "ID",
        QuizEventname = "EVENT_NAME",
        StartDateTime = "START_DATE_TIME",
        EndDateTime = "END_DATE_TIME",
        LifeycleStatusCode = "LIFECYCLE_STATUS",
        NumberOfRounds = "NUM_OF_ROUNDS",
        NumberOfTeams = "NUM_OF_TEAMS",
        CurrentRoundSeq = "CURR_ROUND_SEQ_NUM",
        CurrentQuestionSeq = "CURR_QUESTION_SEQ_NUM",
        Team1UUID = "TEAM_1_UUID",
        Team2UUID = "TEAM_2_UUID",
        Team3UUID = "TEAM_3_UUID",
        Team4UUID = "TEAM_4_UUID"
    }

    export enum Round {
        RoundTypeID = "ROUND_TYPE_ID",
        SequenceNumber = "SEQUENCE_NUM"
    }
}