export enum Table {
  Quiz = "QUIZ",
  Round = "ROUND",
  Question = "QUESTION",
  Team = "TEAM",
}

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
}

export enum Round {
  UUID = "UUID",
  QuizID = "QUIZ_ID",
  RoundName = "ROUND_NAME",
  SequenceNumber = "SEQUENCE_NUM",
  NumQuestionsEachTeam = "NUM_Q_EACH_TEAM",
  FullMarkEachQuestion = "FULL_MARK_EACH_Q",
  IsMCQ = "IS_MULTIPLE_CHOICE",
  IsAudioVisualRound = "IS_AUDIO_VISUAL",
  IsPassable = "IS_PASSABLE",
  TimerSeconds = "TIMER_SECONDS",
}

export enum Question {
  UUID = "UUID",
  RoundUUID = "ROUND_UUID",
  SequenceNumber = "SEQUENCE_NUM",
  Description = "DESCRIPTION",
  Option1 = "OPTION_1",
  Option2 = "OPTION_2",
  Option3 = "OPTION_3",
  Option4 = "OPTION_4",
  Answer = "ANSWER",
  MediaBase64 = "MEDIA_BASE64",
  TargetTeamUUID = "TARGET_TEAM_UUID",
  ActualTeamUUID = "ACTUAL_TEAM_UUID",
  ActualMarkGiven = "ACTUAL_MARK_GIVEN",
  AnswerGiven = "ANSWER_GIVEN",
}

export enum Team {
  UUID = "UUID",
  QuizID = "QUIZ_ID",
  SequenceNumber = "SEQUENCE_NUM",
  TeamName = "TEAM_NAME",
  Member1Name = "MEMBER_1_Name",
  Member2Name = "MEMBER_2_Name",
  Member3Name = "MEMBER_3_Name",
  Member4Name = "MEMBER_4_Name",
  TotalMark = "TOTAL_MARK",
}
