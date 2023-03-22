const Activity = {
    Home: 'HOME',
    Create: 'CREATE',
    Edit: 'EDIT',
    Copy: 'COPY',
    Play: 'PLAY'
}

const QuizStatus = {
    Draft: '1',
    Ready: '2',
    Running: '3',
    Completed: '4'
}

const QuizAction = {
    Start: 'Start',
    Edit: 'Edit',
    Resume: 'Resume',
    ViewResult: 'View Result'
}

const ModifyQuizStep = {
    BasicInfo: 1,
    TeamInfo: 2,
    RoundInfo: 3,
    QuestionInfo: 4,
    LastStep: 4
}

const BackgroundColor = {
    Color1: '#F9DE56',
    Color2: '#FECEA8',
    Color3: '#E84A5F',
    Color4: '#FF847C',
    Color5: '#985bf0',
    Color6: '#F4ECFF'
}

module.exports = { Activity, QuizStatus, QuizAction, ModifyQuizStep, BackgroundColor }