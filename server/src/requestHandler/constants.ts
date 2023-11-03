export enum QuizLifeCycleStatusCode {
    Draft = 1,
    Ready = 2,
    Running = 3,
    Completed = 4
}

export enum GetEndpoint {
    round_types = "round_types",
    quiz_round_details = "quiz_round_details",
    view_quiz_data = "view_quiz_data",
    all_quizzes = "all_quizzes",
    basic_info = "basic_info",
    team_info = "team_info",
    rounds = "rounds",
    questions = "questions",
    about_quiz = "about_quiz"
}

export enum PostEndpoint {
    basic_info = "basic_info",
    team_info = "team_info",
    round_info = "round_info",
    question_info = "question_info",
    ready = "ready"
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
        QuizID = "QUIZ_ID",
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
        MediaBase64 = "MEDIA_BASE64",
        TargetTeamUUID = "TARGET_TEAM_UUID",
        ActualTeamUUID = "ACTUAL_TEAM_UUID",
        ActualMarkGiven = "ACTUAL_MARK_GIVEN",
        AnswerGiven = "ANSWER_GIVEN"
    }

    export enum Team {
        UUID = "UUID",
        TeamName = "TEAM_NAME",
        Member1 = "MEMBER_1_UUID",
        Member2 = "MEMBER_2_UUID",
        Member3 = "MEMBER_3_UUID",
        Member4 = "MEMBER_4_UUID",
        TotalMark = "TOTAL_MARK"
    }
}