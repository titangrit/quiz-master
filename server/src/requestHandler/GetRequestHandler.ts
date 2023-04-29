import { Request, Response } from 'express';
import { DbHandlerMySql } from "../dbHandlerMySql";
import {
    GetParam, ViewQuizData, GetAllQuizzes, QuizBasicInfo,
    QuizTeamsDetail,
    RoundQuestionsDetail,
    GetEndpoint
} from "../common";

export class GetRequestHandler {

    static async handleGET(req: Request, res: Response): Promise<void> {
        const db = await DbHandlerMySql.getInstance();

        if (req.params[0] === GetEndpoint.RoundTypes) {

            try {
                const roundTypes: GetParam.RoundType[] = await db.getRoundTypes();
                res.json({ RoundTypes: roundTypes });
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.RoundDetailsOfEachQuiz) {
            const _quizID = req.query.quizID as string;
            const quizID = parseInt(_quizID);

            if (Number.isNaN(quizID)) {
                res.status(404).send();
            }

            try {
                const quiz: GetParam.Quiz = await db.getQuizByID(quizID);
                const _rounds: GetParam.Round[] = await db.getRoundsByQuizID(quizID);
                let rounds = _rounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                rounds = rounds.slice(0, quiz.NumberOfRounds);

                const quizRounds = [];
                for (let _round of rounds) {
                    const _roundType = await db.getRoundTypeByID(_round.RoundTypeID);
                    const _quizRoundType = {
                        UUID: _round.UUID,
                        SequenceNumber: _round.SequenceNumber,
                        RoundTypeID: _round.RoundTypeID,
                        RoundTypeName: _roundType.RoundTypeName,
                        NumQuestionsEachTeam: _roundType.NumQuestionsEachTeam,
                        IsMCQ: _roundType.IsMCQ,
                        IsAVRound: _roundType.IsAVRound
                    }
                    quizRounds.push(_quizRoundType)
                }

                res.json(quizRounds);
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.ViewQuiz) {
            const _quizID = req.query.quizID as string;
            const quizID = parseInt(_quizID);

            if (Number.isNaN(quizID)) {
                res.status(404).send();
            }

            try {
                const viewQuizData: ViewQuizData.Quiz = {} as ViewQuizData.Quiz;

                // Basic Detail
                const quiz: GetParam.Quiz = await db.getQuizByID(quizID);
                viewQuizData.QuizID = quiz.QuizEventID;
                viewQuizData.QuizEventName = quiz.QuizEventname;
                viewQuizData.LifecycleStatusCode = quiz.LifeycleStatusCode;
                viewQuizData.NumberOfRounds = quiz.NumberOfRounds;
                viewQuizData.NumberOfTeams = quiz.NumberOfTeams;

                // Teams Detail
                const teamUUIDs = [quiz.Team1UUID, quiz.Team2UUID, quiz.Team3UUID, quiz.Team4UUID];
                const teams: GetParam.Team[] = [];
                for (let teamUUID of teamUUIDs) {
                    if (!teamUUID) {
                        break;
                    }
                    const team: GetParam.Team = await db.getTeamByUUID(teamUUID as string);
                    teams.push(team);
                }

                viewQuizData.Teams = [];
                if (!!teams[0]) {
                    viewQuizData.Teams.push({
                        TeamName: teams[0].TeamName,
                        Member1: teams[0].Member1,
                        Member2: teams[0].Member2,
                        Member3: teams[0].Member3,
                        Member4: teams[0].Member4,

                    });
                }
                if (!!teams[1]) {
                    viewQuizData.Teams.push({
                        TeamName: teams[1].TeamName,
                        Member1: teams[1].Member1,
                        Member2: teams[1].Member2,
                        Member3: teams[1].Member3,
                        Member4: teams[1].Member4,

                    });
                }
                if (!!teams[2]) {

                    viewQuizData.Teams.push({
                        TeamName: teams[2].TeamName,
                        Member1: teams[2].Member1,
                        Member2: teams[2].Member2,
                        Member3: teams[2].Member3,
                        Member4: teams[2].Member4,

                    });
                }
                if (!!teams[3]) {
                    viewQuizData.Teams.push({
                        TeamName: teams[3].TeamName,
                        Member1: teams[3].Member1,
                        Member2: teams[3].Member2,
                        Member3: teams[3].Member3,
                        Member4: teams[3].Member4,

                    });
                }

                viewQuizData.Teams = viewQuizData.Teams.slice(0, quiz.NumberOfTeams);

                // Rounds Detail
                viewQuizData.Rounds = [];

                let _rounds: GetParam.Round[] = await db.getRoundsByQuizID(quizID);
                _rounds = _rounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                })

                _rounds = _rounds.slice(0, quiz.NumberOfRounds);

                for (let round of _rounds) {
                    // Round type detail
                    const _roundType: GetParam.RoundType = await db.getRoundTypeByID(round.RoundTypeID);

                    // Questions Detail
                    let _questions: GetParam.Question[] = await db.getQuestionsByRoundUUID(round.UUID);
                    _questions = _questions.sort((x, y) => {
                        if (x.SequenceNumber > y.SequenceNumber) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    let questions: ViewQuizData.Question[] = [];

                    for (let question of _questions) {

                        let correctOption: string;
                        if (question.Answer === question.Option1) {
                            correctOption = "A";
                        } else if (question.Answer === question.Option2) {
                            correctOption = "B";
                        } else if (question.Answer === question.Option3) {
                            correctOption = "C";
                        } else if (question.Answer === question.Option4) {
                            correctOption = "D";
                        } else {
                            correctOption = '';
                        }

                        const q: ViewQuizData.Question = {
                            SequenceNumber: question.SequenceNumber,
                            Description: question.Description,
                            Answer: question.Answer,
                            Option1: question.Option1,
                            Option2: question.Option2,
                            Option3: question.Option3,
                            Option4: question.Option4,
                            CorrectOption: correctOption
                        }

                        if (!!question.MediaBase64) {
                            q.MediaBase64 = question.MediaBase64;
                        }

                        questions.push(q);
                    }

                    questions = questions.slice(0, _roundType.NumQuestionsEachTeam * quiz.NumberOfTeams);

                    viewQuizData.Rounds.push({
                        SequenceNumber: round.SequenceNumber,
                        RoundTypeID: _roundType.RoundTypeID,
                        RoundTypeName: _roundType.RoundTypeName,
                        FullMarkEachQuestion: _roundType.FullMarkEachQuestion,
                        NumQuestionsEachTeam: _roundType.NumQuestionsEachTeam,
                        IsMCQ: _roundType.IsMCQ,
                        IsAVRound: _roundType.IsAVRound,
                        IsPassable: _roundType.IsPassable,
                        TimerSeconds: _roundType.TimerSeconds,
                        Questions: questions
                    })

                }

                res.json(viewQuizData);
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.GetAllQuizzes) {

            let allQuizzes: GetAllQuizzes.Quizzes = [];
            try {
                const quizzes = await db.getAllQuizzes();
                for (let quiz of quizzes) {
                    allQuizzes.push({
                        QuizID: quiz.QuizEventID,
                        QuizEventName: quiz.QuizEventname,
                        LifecycleStatusCode: quiz.LifeycleStatusCode,
                        CompletedOnDate: quiz.EndDateTime?.toLocaleDateString()
                    })
                }

                // Sort descending by quiz ID
                allQuizzes = allQuizzes.sort((x, y) => {
                    if (x.QuizID < y.QuizID) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                res.json(allQuizzes);

            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.QuizBasicInfo) {

            try {
                const _quizID = req.query.quizID as string;
                const quizID = parseInt(_quizID);

                if (Number.isNaN(quizID)) {
                    res.status(404).send();
                }

                let quizData: GetParam.Quiz;
                try {
                    quizData = await db.getQuizByID(quizID);
                } catch (e) {
                    res.status(404).send();
                    return;
                }
                const response: QuizBasicInfo = {
                    QuizEventID: quizData.QuizEventID,
                    QuizEventName: quizData.QuizEventname,
                    NumberOfTeams: quizData.NumberOfTeams,
                    NumberOfRounds: quizData.NumberOfRounds
                }
                res.json(response);
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.QuizTeamsInfo) {

            try {
                const _quizID = req.query.quizID as string;
                const quizID = parseInt(_quizID);

                if (Number.isNaN(quizID)) {
                    res.status(404).send();
                }

                let quiz: GetParam.Quiz;

                try {
                    quiz = await db.getQuizByID(quizID);
                } catch (e) {
                    res.status(404).send();
                    return;
                }

                const member: QuizTeamsDetail.Member = {
                    Surname: '',
                    Name: '',
                    LastName: ''
                }

                const Team: QuizTeamsDetail.Team = {
                    TeamName: '',
                    Members: [member, member, member, member]
                }

                const response: QuizTeamsDetail.Teams = [Team, Team, Team, Team];

                if (!!quiz.Team1UUID) {
                    const team: GetParam.Team = await db.getTeamByUUID(quiz.Team1UUID);
                    response[0] = {
                        TeamName: team.TeamName,
                        Members: [
                            {
                                Surname: team.Member1.Surname,
                                Name: team.Member1.Name,
                                LastName: team.Member1.Lastname
                            },
                            {
                                Surname: team.Member2.Surname,
                                Name: team.Member2.Name,
                                LastName: team.Member2.Lastname
                            },
                            {
                                Surname: team.Member3.Surname,
                                Name: team.Member3.Name,
                                LastName: team.Member3.Lastname
                            },
                            {
                                Surname: team.Member4.Surname,
                                Name: team.Member4.Name,
                                LastName: team.Member4.Lastname
                            }
                        ]
                    }
                }
                if (!!quiz.Team2UUID) {
                    const team: GetParam.Team = await db.getTeamByUUID(quiz.Team2UUID);
                    response[1] = {
                        TeamName: team.TeamName,
                        Members: [
                            {
                                Surname: team.Member1.Surname,
                                Name: team.Member1.Name,
                                LastName: team.Member1.Lastname
                            },
                            {
                                Surname: team.Member2.Surname,
                                Name: team.Member2.Name,
                                LastName: team.Member2.Lastname
                            },
                            {
                                Surname: team.Member3.Surname,
                                Name: team.Member3.Name,
                                LastName: team.Member3.Lastname
                            },
                            {
                                Surname: team.Member4.Surname,
                                Name: team.Member4.Name,
                                LastName: team.Member4.Lastname
                            }
                        ]
                    }
                }
                if (!!quiz.Team3UUID) {
                    const team: GetParam.Team = await db.getTeamByUUID(quiz.Team3UUID);
                    response[2] = {
                        TeamName: team.TeamName,
                        Members: [
                            {
                                Surname: team.Member1.Surname,
                                Name: team.Member1.Name,
                                LastName: team.Member1.Lastname
                            },
                            {
                                Surname: team.Member2.Surname,
                                Name: team.Member2.Name,
                                LastName: team.Member2.Lastname
                            },
                            {
                                Surname: team.Member3.Surname,
                                Name: team.Member3.Name,
                                LastName: team.Member3.Lastname
                            },
                            {
                                Surname: team.Member4.Surname,
                                Name: team.Member4.Name,
                                LastName: team.Member4.Lastname
                            }
                        ]
                    }
                }
                if (!!quiz.Team4UUID) {
                    const team: GetParam.Team = await db.getTeamByUUID(quiz.Team4UUID);
                    response[3] = {
                        TeamName: team.TeamName,
                        Members: [
                            {
                                Surname: team.Member1.Surname,
                                Name: team.Member1.Name,
                                LastName: team.Member1.Lastname
                            },
                            {
                                Surname: team.Member2.Surname,
                                Name: team.Member2.Name,
                                LastName: team.Member2.Lastname
                            },
                            {
                                Surname: team.Member3.Surname,
                                Name: team.Member3.Name,
                                LastName: team.Member3.Lastname
                            },
                            {
                                Surname: team.Member4.Surname,
                                Name: team.Member4.Name,
                                LastName: team.Member4.Lastname
                            }
                        ]
                    }
                }

                res.json(response);
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.QuizRounds) {
            try {
                const _quizID = req.query.quizID as string;
                const quizID = parseInt(_quizID);

                if (Number.isNaN(quizID)) {
                    res.status(404).send();
                }

                let currentRounds: GetParam.Round[] = await db.getRoundsByQuizID(quizID);
                currentRounds = currentRounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                const quiz: GetParam.Quiz = await db.getQuizByID(quizID);
                currentRounds = currentRounds.slice(0, quiz.NumberOfRounds);

                res.json(currentRounds);

            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.QuestionDetailsOfEachRound) {
            try {
                const roundUUID = req.query.roundUUID as string;

                if (!roundUUID) {
                    res.status(404).send();
                }

                const round: GetParam.Round = await db.getRoundByUUID(roundUUID);
                const roundType: GetParam.RoundType = await db.getRoundTypeByID(round.RoundTypeID);
                const quiz: GetParam.Quiz = await db.getQuizByID(round.QuizID);
                const totalNumQuestions = roundType.NumQuestionsEachTeam * quiz.NumberOfTeams;

                const currentQuestions: GetParam.Question[] = await db.getQuestionsByRoundUUID(roundUUID);
                let questions: RoundQuestionsDetail.Questions = [];
                for (let question of currentQuestions) {
                    let correctOption;
                    switch (question.Answer) {
                        case question.Option1:
                            correctOption = "A";
                            break;
                        case question.Option2:
                            correctOption = "B";
                            break;
                        case question.Option3:
                            correctOption = "C";
                            break;
                        case question.Option4:
                            correctOption = "D";
                            break;
                    }
                    questions.push({
                        UUID: question.UUID,
                        SequenceNumber: question.SequenceNumber,
                        Description: question.Description,
                        Answer: question.Answer,
                        Option1: question.Option1,
                        Option2: question.Option2,
                        Option3: question.Option3,
                        Option4: question.Option4,
                        CorrectOption: correctOption,
                        MediaBase64: question.MediaBase64
                    });
                }

                questions = questions.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                questions = questions.slice(0, totalNumQuestions);

                res.json(questions);

            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === GetEndpoint.AboutQuiz) {
            const _quizID = req.query.quizID as string;
            const quizID = parseInt(_quizID);

            if (Number.isNaN(quizID)) {
                res.status(404).send();
            }

            type AboutQuiz = {
                QuizEventName: string,
                NumberOfTeams: number,
                NumberOfRounds: number,
                RoundTypes: GetParam.RoundType[]
            }

            try {
                const quiz: GetParam.Quiz = await db.getQuizByID(quizID);
                const _rounds: GetParam.Round[] = await db.getRoundsByQuizID(quizID);
                let rounds = _rounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                rounds = rounds.slice(0, quiz.NumberOfRounds);

                const roundTypes: GetParam.RoundType[] = [];
                for (let _round of rounds) {
                    const _roundType = await db.getRoundTypeByID(_round.RoundTypeID);
                    const _quizRoundType: GetParam.RoundType = {
                        RoundTypeID: _round.RoundTypeID,
                        RoundTypeName: _roundType.RoundTypeName,
                        NumQuestionsEachTeam: _roundType.NumQuestionsEachTeam,
                        IsMCQ: _roundType.IsMCQ,
                        IsAVRound: _roundType.IsAVRound,
                        IsPassable: _roundType.IsPassable,
                        TimerSeconds: _roundType.TimerSeconds,
                        FullMarkEachQuestion: _roundType.FullMarkEachQuestion
                    }
                    roundTypes.push(_quizRoundType)
                }

                const response: AboutQuiz = {
                    QuizEventName: quiz.QuizEventname,
                    NumberOfTeams: quiz.NumberOfTeams,
                    NumberOfRounds: quiz.NumberOfRounds,
                    RoundTypes: roundTypes
                }

                res.json(response);
            } catch (err) {
                res.status(500).send();
            }
        }

        else {
            res.status(404).send();
        }
    }
}
