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
        UUID = "UUID",
        RoundTypeID = "ROUND_TYPE_ID",
        SequenceNumber = "SEQUENCE_NUM"
    }

    export enum Question {
        UUID = "UUID",
        Description = " DESCRIPTION",
        Option1 = "OPTION_1",
        Option2 = "OPTION_2",
        Option3 = "OPTION_3",
        Option4 = "OPTION_4",
        Answer = "ANSWER",
        MediaUUID = "MEDIA_UUID",
        TargetTeamUUID = "TARGET_TEAM_UUID",
        ActualTeamUUID = "ACTUAL_TEAM_UUID",
        ActualMarkGiven = "ACTUAL_MARK_GIVEN",
        AnswerGiven = "ANSWER_GIVEN"
    }
}