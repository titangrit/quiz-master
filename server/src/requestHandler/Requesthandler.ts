import { Request, Response } from 'express';
import { DbHandlerMySql } from "../dbHandlerMySql";
import { CreateParam, GetResponseParam, UpdateParam, ViewQuizData, GetAllQuizzes, QuizLifeCycleStatusCode, QuizBasicInfo } from "../common";

export class RequestHandler {

    handleGET = async (req: Request, res: Response): Promise<void> => {
        const db = await DbHandlerMySql.getInstance();

        if (req.params[0] === 'round_types') {

            try {
                const roundTypes: GetResponseParam.RoundType[] = await db.getRoundTypes();
                res.json({ RoundTypes: roundTypes });
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'quiz_round_details') {
            const _quizID = req.query.quizID as string;
            const quizID = parseInt(_quizID);

            try {
                const _rounds: GetResponseParam.Round[] = await db.getRoundsByQuizID(quizID);
                const rounds = _rounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                const quizRoundTypes = [];
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
                    quizRoundTypes.push(_quizRoundType)
                }

                res.json({ QuizRoundTypes: quizRoundTypes });
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'quiz_data') {
            const _quizID = req.query.quizID as string;
            const quizID = parseInt(_quizID);

            try {
                const viewQuizData: ViewQuizData.Quiz = {} as ViewQuizData.Quiz;

                // Basic Detail
                const quiz: GetResponseParam.Quiz = await db.getQuizByID(quizID);
                viewQuizData.QuizID = quiz.QuizEventID;
                viewQuizData.QuizEventName = quiz.QuizEventname;
                viewQuizData.LifecycleStatusCode = quiz.LifeycleStatusCode;
                viewQuizData.NumberOfRounds = quiz.NumberOfRounds;
                viewQuizData.NumberOfTeams = quiz.NumberOfTeams;

                // Teams Detail
                const teamUUIDs = [quiz.Team1UUID, quiz.Team2UUID, quiz.Team3UUID, quiz.Team4UUID];
                const teams: GetResponseParam.Team[] = [];
                for (let teamUUID of teamUUIDs) {
                    if (!teamUUID) {
                        break;
                    }
                    const team: GetResponseParam.Team = await db.getTeamByUUID(teamUUID as string);
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

                // Rounds Detail
                viewQuizData.Rounds = [];

                let _rounds: GetResponseParam.Round[] = await db.getRoundsByQuizID(quizID);
                _rounds = _rounds.sort((x, y) => {
                    if (x.SequenceNumber > y.SequenceNumber) {
                        return 1;
                    } else {
                        return -1;
                    }
                })

                for (let round of _rounds) {
                    // Round type detail
                    const _roundType: GetResponseParam.RoundType = await db.getRoundTypeByID(round.RoundTypeID);

                    // Questions Detail
                    let _questions: GetResponseParam.Question[] = await db.getQuestionsByRoundUUID(round.UUID);
                    _questions = _questions.sort((x, y) => {
                        if (x.SequenceNumber > y.SequenceNumber) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    const questions: ViewQuizData.Question[] = [];

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

                        questions.push(q);
                    }

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

        } else if (req.params[0] === 'all_quizzes') {

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

        } else if (req.params[0] === 'basic_info') {

            try {
                const _quizID = req.query.quizID as string;
                const quizID = parseInt(_quizID);

                const quizData: GetResponseParam.Quiz = await db.getQuizByID(quizID);
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

        } else {
            res.status(404).send();
        }
    }

    handlePOST = async (req: Request, res: Response): Promise<void> => {
        const db = await DbHandlerMySql.getInstance();

        if (req.params[0] === 'basic_info') {
            try {
                if (!!req.body.QuizEventID) {
                    // Edit quiz
                    const quizID = req.body.QuizEventID;

                    let param: UpdateParam.QuizInstance = {} as UpdateParam.QuizInstance;
                    if (!!req.body.QuizEventName) {
                        param.QuizEventName = req.body.QuizEventName;
                    }
                    if (!!req.body.NumberOfRounds) {
                        param.NumberOfRounds = req.body.NumberOfRounds;
                    }
                    if (!!req.body.NumberOfTeams) {
                        param.NumberOfTeams = req.body.NumberOfTeams;
                    }

                    await db.updateQuizInstance(quizID, param);
                    res.json({ QuizEventID: quizID });
                } else {
                    // New quiz
                    let param: CreateParam.QuizInstance = {
                        QuizEventName: req.body.QuizEventName,
                        NumberOfRounds: req.body.NumberOfRounds,
                        NumberOfTeams: req.body.NumberOfTeams
                    };

                    const quizID = await db.createQuizInstance(param);
                    res.json({ QuizEventID: quizID });
                }
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'team_info') {

            try {
                const quizID = req.body.QuizID;
                const teams = req.body.Teams;

                // create teams
                const teamUUIDs = [];
                for (let _t = 0; _t < teams.length; _t++) {
                    // create members
                    const memberUUIDs = [];
                    for (let _m = 0; _m < 4; _m++) {
                        if (!teams[_t].Members[_m].Surname && !teams[_t].Members[_m].Name && !teams[_t].Members[_m].Lastname) {
                            continue;
                        }
                        let param: CreateParam.MemberInstance = {
                            Surname: teams[_t].Members[_m].Surname,
                            Name: teams[_t].Members[_m].Name,
                            Lastname: teams[_t].Members[_m].Lastname
                        }
                        const memberUUID = await db.createMemberInstance(param);
                        memberUUIDs.push(memberUUID);
                    }

                    let param: CreateParam.TeamInstance = {} as CreateParam.TeamInstance;
                    param.TeamName = teams[_t].TeamName;

                    // associate members
                    let i = 0;
                    if (memberUUIDs.length > i) {
                        param.Member1UUID = memberUUIDs[i];
                        i++;
                    }
                    if (memberUUIDs.length > i) {
                        param.Member2UUID = memberUUIDs[i];
                        i++
                    }
                    if (memberUUIDs.length > i) {
                        param.Member3UUID = memberUUIDs[i];
                        i++
                    }
                    if (memberUUIDs.length > i) {
                        param.Member4UUID = memberUUIDs[i];
                    }

                    const teamUUID = await db.createTeamInstance(param);
                    teamUUIDs.push(teamUUID);
                }

                // associate teams to quiz
                let param: UpdateParam.QuizInstance = {};
                let i = 0;
                if (teamUUIDs.length > i) {
                    param.Team1UUID = teamUUIDs[i];
                    i++;
                }
                if (teamUUIDs.length > i) {
                    param.Team2UUID = teamUUIDs[i];
                    i++
                }
                if (teamUUIDs.length > i) {
                    param.Team3UUID = teamUUIDs[i];
                    i++
                }
                if (teamUUIDs.length > i) {
                    param.Team4UUID = teamUUIDs[i];
                }

                await db.updateQuizInstance(quizID, param);

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'round_info') {

            try {
                const quizID = req.body.QuizID;
                const rounds = req.body.Rounds;

                for (let _r = 0; _r < rounds.length; _r++) {
                    if (!!rounds[_r].RoundTypeName) {
                        // if RoundTypeName is part of the payload, it is a new round type to be created
                        let param: CreateParam.RoundTypeInstance = {
                            RoundTypeID: rounds[_r].RoundTypeID,
                            RoundTypeName: rounds[_r].RoundTypeName,
                            FullMarkEachQuestion: rounds[_r].FullMarkEachQuestion,
                            IsAVRound: rounds[_r].IsAVRound,
                            IsMCQ: rounds[_r].IsMCQ,
                            IsPassable: rounds[_r].IsPassable,
                            NumQuestionsEachTeam: rounds[_r].NumQuestionsEachTeam,
                            TimerSeconds: rounds[_r].TimerSeconds
                        }

                        await db.createRoundTypeInstance(param);
                    }

                    let param: CreateParam.RoundInstance = {
                        QuizID: quizID,
                        RoundTypeID: rounds[_r].RoundTypeID,
                        SequenceNumber: _r + 1
                    }

                    await db.createRoundInstance(param);
                }

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'question_info') {

            try {
                const roundUUID = req.body.RoundUUID;
                const questions = req.body.Questions;

                for (let _q = 0; _q < questions.length; _q++) {
                    let param: CreateParam.QuestionInstance = {
                        RoundUUID: roundUUID,
                        SequenceNumber: questions[_q].SequenceNumber,
                        Description: questions[_q].Description,
                        Answer: questions[_q].Answer,
                        MediaUUID: questions[_q]?.MediaUUID,
                        Option1: questions[_q]?.Option1,
                        Option2: questions[_q]?.Option2,
                        Option3: questions[_q]?.Option3,
                        Option4: questions[_q]?.Option4
                    }

                    await db.createQuestionInstance(param);
                }

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === 'ready') {
            try {
                const quizID = req.body.quizID;
                const param: UpdateParam.QuizInstance = {
                    LifecycleStatusCode: QuizLifeCycleStatusCode.Ready
                }

                await db.updateQuizInstance(quizID, param);

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else {
            res.status(404).send();
        }
    }
}
