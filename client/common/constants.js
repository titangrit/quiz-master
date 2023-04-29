const QuizLifeCycleStatusCode = {
    Draft: 1,
    Ready: 2,
    Running: 3,
    Completed: 4
}

const GetEndpoint = {
    RoundTypes: "/quiz/round_types",
    RoundDetailsOfEachQuiz: "/quiz/quiz_round_details",
    ViewQuiz: "/quiz/view_quiz_data",
    GetAllQuizzes: "/quiz/all_quizzes",
    QuizBasicInfo: "/quiz/basic_info",
    QuizTeamsInfo: "/quiz/team_info",
    QuizRounds: "/quiz/rounds",
    QuestionDetailsOfEachRound: "/quiz/questions",
}

const PostEndpoint = {
    QuizBasicInfo: "/quiz/basic_info",
    QuizTeamsInfo: "/quiz/team_info",
    QuizRoundsInfo: "/quiz/round_info",
    QuestionsInfoOfEachRound: "/quiz/question_info",
    SetQuizStateReady: "/quiz/ready"
}

const ModifyQuizStep = {
    BasicInfo: 1,
    TeamInfo: 2,
    RoundInfo: 3,
    QuestionInfo: 4,
    LastStep: 4
}

const PlayQuizStep = {
    TeamInfo: 1,
    AboutQuiz: 2,
    Rounds: 3,
    FinalResult: 4,
    LastStep: 4
}

const PlayQuizEachRoundStep = {
    RoundInfo: 1,
    Questions: 2,
    RoundResult: 3,
    LastStep: 3
}


const QuizAction = {
    Start: 'Start',
    Edit: 'Edit',
    Resume: 'Resume',
    ViewResult: 'View Result'
}


const Activity = {
    Home: 'HOME',
    Create: 'CREATE',
    Edit: 'EDIT',
    Copy: 'COPY',
    Play: 'PLAY'
}

const BackgroundColor = {
    Color1: '#F9DE56',
    Color2: '#FECEA8',
    Color3: '#E84A5F',
    Color4: '#FF847C',
    Color5: '#985bf0',
    Color6: '#F4ECFF'
}

module.exports = { QuizLifeCycleStatusCode, GetEndpoint, PostEndpoint, ModifyQuizStep, PlayQuizStep, PlayQuizEachRoundStep }