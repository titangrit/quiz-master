import { Request, Response } from 'express';
import { DbHandlerMySql } from "../dbHandlerMySql";
import {
    CreateParam, GetParam, UpdateParam, QuizLifeCycleStatusCode,
    PostEndpoint
} from "../common";

export class PostRequestHandler {

    static async handlePOST(req: Request, res: Response): Promise<void> {
        const db = await DbHandlerMySql.getInstance();

        if (req.params[0] === PostEndpoint.QuizBasicInfo) {
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
                        param.LifecycleStatusCode = QuizLifeCycleStatusCode.Draft;
                    }
                    if (!!req.body.NumberOfTeams) {
                        param.NumberOfTeams = req.body.NumberOfTeams;
                        param.LifecycleStatusCode = QuizLifeCycleStatusCode.Draft; // repeated but necessary!
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

        } else if (req.params[0] === PostEndpoint.QuizTeamsInfo) {

            try {
                const quizID = req.body.QuizID;
                const teams = req.body.Teams;

                // delete existing teams and members for edit scenario to create them from scratch
                const quiz: GetParam.Quiz = await db.getQuizByID(quizID);
                if (!!quiz.Team1UUID) {
                    await db.deleteTeamInstance(quiz.Team1UUID);
                }
                if (!!quiz.Team2UUID) {
                    await db.deleteTeamInstance(quiz.Team2UUID);
                }
                if (!!quiz.Team3UUID) {
                    await db.deleteTeamInstance(quiz.Team3UUID);
                }
                if (!!quiz.Team4UUID) {
                    await db.deleteTeamInstance(quiz.Team4UUID);
                }

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

        } else if (req.params[0] === PostEndpoint.QuizRoundsInfo) {

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

                    let quizStatusAffected = false;

                    if (!!rounds[_r].UUID) {
                        // If round UUID is part of the payload, it is edit of this round
                        let param: UpdateParam.RoundInstance = {
                            RoundTypeID: rounds[_r].RoundTypeID
                        }

                        await db.updateRoundInstance(rounds[_r].UUID, param);

                        quizStatusAffected = true;

                    } else {
                        // It is new round
                        let param: CreateParam.RoundInstance = {
                            QuizID: quizID,
                            RoundTypeID: rounds[_r].RoundTypeID,
                            SequenceNumber: rounds[_r].SequenceNumber
                        }

                        await db.createRoundInstance(param);
                    }

                    if (quizStatusAffected) {
                        let param: UpdateParam.QuizInstance = {} as UpdateParam.QuizInstance;
                        param.LifecycleStatusCode = QuizLifeCycleStatusCode.Draft;
                        await db.updateQuizInstance(quizID, param);
                    }
                }

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === PostEndpoint.QuestionsInfoOfEachRound) {

            try {
                const roundUUID = req.body.RoundUUID;
                const questions = req.body.Questions;

                for (let _q = 0; _q < questions.length; _q++) {

                    if (!!questions[_q].UUID) {
                        // If question UUID is part of the payload, it is edit of existing question
                        const param: UpdateParam.QuestionInstance = {};

                        if (!!questions[_q].Description) {
                            param.Description = questions[_q].Description;
                        }
                        if (!!questions[_q].Option1) {
                            param.Option1 = questions[_q].Option1;
                        }
                        if (!!questions[_q].Option2) {
                            param.Option2 = questions[_q].Option2;
                        }
                        if (!!questions[_q].Option3) {
                            param.Option3 = questions[_q].Option3;
                        }
                        if (!!questions[_q].Option4) {
                            param.Option4 = questions[_q].Option4;
                        }
                        if (!!questions[_q].MediaUUID) {
                            param.MediaUUID = questions[_q].MediaUUID;
                        }

                        if (!!questions[_q].Answer) {
                            param.Answer = questions[_q].Answer;
                        } else {
                            switch (questions[_q].CorrectOption) {
                                case 'A':
                                    param.Answer = questions[_q]?.Option1;
                                    break;
                                case 'B':
                                    param.Answer = questions[_q]?.Option2;
                                    break;
                                case 'C':
                                    param.Answer = questions[_q]?.Option3;
                                    break;
                                case 'D':
                                    param.Answer = questions[_q]?.Option4;
                                    break;
                            }
                        }

                        await db.updateQuestionInstance(questions[_q].UUID, param);

                    } else {
                        // New question instance
                        let answer: string = '';
                        if (!!questions[_q]?.Answer) {
                            answer = questions[_q]?.Answer;
                        } else {
                            switch (questions[_q].CorrectOption) {
                                case 'A':
                                    answer = questions[_q]?.Option1;
                                    break;
                                case 'B':
                                    answer = questions[_q]?.Option2;
                                    break;
                                case 'C':
                                    answer = questions[_q]?.Option3;
                                    break;
                                case 'D':
                                    answer = questions[_q]?.Option4;
                                    break;
                            }
                        }

                        let param: CreateParam.QuestionInstance = {
                            RoundUUID: roundUUID,
                            SequenceNumber: questions[_q].SequenceNumber,
                            Description: questions[_q].Description,
                            Answer: answer,
                            MediaUUID: questions[_q]?.MediaUUID,
                            Option1: questions[_q]?.Option1,
                            Option2: questions[_q]?.Option2,
                            Option3: questions[_q]?.Option3,
                            Option4: questions[_q]?.Option4
                        }

                        await db.createQuestionInstance(param);
                    }

                }

                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }

        } else if (req.params[0] === PostEndpoint.SetQuizStateReady) {
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
