export enum Table {
  Quiz = "QUIZ",
  Round = "ROUND",
  Question = "QUESTION",
  Team = "TEAM",
  Member = "MEMBER",
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
  Team1UUID = "TEAM_1_UUID",
  Team2UUID = "TEAM_2_UUID",
  Team3UUID = "TEAM_3_UUID",
  Team4UUID = "TEAM_4_UUID",
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
  AnswerGiven = "ANSWER_GIVEN",
}

export enum Member {
  UUID = "UUID",
  Surname = "SURNAME",
  Name = "NAME",
  Lastname = "LASTNAME",
}

export enum Team {
  UUID = "UUID",
  TeamName = "TEAM_NAME",
  Member1UUID = "MEMBER_1_UUID",
  Member2UUID = "MEMBER_2_UUID",
  Member3UUID = "MEMBER_3_UUID",
  Member4UUID = "MEMBER_4_UUID",
  TotalMark = "TOTAL_MARK",
}
