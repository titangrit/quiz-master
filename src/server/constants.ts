export enum QuizLifecycleStatusCode {
  Draft = 1,
  Ready = 2,
  Running = 3,
  Completed = 4,
}

export enum Endpoint {
  get_all_quizzes = "get_all_quizzes",
  get_quiz = "get_quiz",
  get_quiz_teams = "get_quiz_teams",
  get_quiz_rounds = "get_quiz_rounds",
  get_quiz_round_questions = "get_quiz_round_questions",

  create_quiz = "create_quiz",
  create_quiz_teams = "create_quiz_teams",
  create_quiz_rounds = "create_quiz_rounds",
  create_quiz_round_questions = "create_quiz_round_questions",

  edit_quiz = "edit_quiz",
  edit_quiz_teams = "edit_quiz_teams",
  edit_quiz_rounds = "edit_quiz_rounds",
  edit_quiz_round_questions = "edit_quiz_round_questions",

  set_quiz_status = "set_quiz_status",

  record_quiz_progress = "record_quiz_progress",
  record_team_response = "record_team_response",
}
