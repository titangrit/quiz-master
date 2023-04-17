import { DbHandler, CreateParam, UpdateParam, GetParam, QuizLifeCycleStatusCode, QuizMasterSchema } from "../common";
import * as mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import assert from 'node:assert';
import logger from "../logger";

export class DbHandlerMySql extends DbHandler {
    static INSTANCE: DbHandlerMySql;
    private db_conn!: mysql.Connection;

    private constructor() {
        super();
    }

    static async getInstance(): Promise<DbHandler> {
        if (!this.INSTANCE) {
            this.INSTANCE = new DbHandlerMySql();

            require('dotenv').config();
            const HOST = "localhost"
            const USER = process.env.MYSQL_USER
            const PASS = process.env.MYSQL_PASS
            const DB = process.env.MYSQL_DB

            this.INSTANCE.db_conn = await mysql.createConnection({
                host: HOST,
                user: USER,
                password: PASS,
                database: DB
            });
        }

        return this.INSTANCE;
    }

    async createQuizInstance(param: CreateParam.QuizInstance): Promise<number> {
        let quizID: number;

        const statement = "INSERT INTO `QUIZ` (`EVENT_NAME`, `NUM_OF_ROUNDS`, `NUM_OF_TEAMS`, `LIFECYCLE_STATUS`) VALUES (?, ?, ?, ?)";
        const values = [param.QuizEventName, param.NumberOfRounds, param.NumberOfTeams, QuizLifeCycleStatusCode.Draft];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            quizID = _result.insertId;
            assert(!!quizID);

            logger.info(`DbHandlerMySql->createQuizInstance :: Quiz Instance Successfully Created; ID: ${quizID}`);
        } catch (err) {
            logger.error("DbHandlerMySql->createQuizInstance :: Failed to Create Quiz Instance");
            logger.error(err);
            throw err;
        }

        return quizID;
    }

    async createMemberInstance(param: CreateParam.MemberInstance): Promise<string> {
        let memberUUID: string = uuidv4();

        const statement = "INSERT INTO `MEMBER` (`UUID`, `SURNAME`, `NAME`, `LASTNAME`) VALUES (?, ?, ?, ?)";
        const values = [memberUUID, param.Surname, param.Name, param.Lastname];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, "DbHandlerMySql->createMemberInstance :: Failed to Create Member Instance");

            logger.info(`DbHandlerMySql->createMemberInstance :: Member Instance Successfully Created; UUID: ${memberUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return memberUUID;
    }

    async createTeamInstance(param: CreateParam.TeamInstance): Promise<string> {
        let teamUUID: string = uuidv4();

        const statement = "INSERT INTO `TEAM` (`UUID`, `TEAM_NAME`, `MEMBER_1_UUID`, `MEMBER_2_UUID`, MEMBER_3_UUID, MEMBER_4_UUID) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [teamUUID, param.TeamName, param.Member1UUID, param.Member2UUID, param.Member3UUID, param.Member4UUID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, "DbHandlerMySql->createTeamInstance :: Failed to Create Team Instance");

            logger.info(`DbHandlerMySql->createTeamInstance :: Team Instance Successfully Created; UUID: ${teamUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return teamUUID;
    }

    async createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string> {
        const statement = "INSERT IGNORE INTO `ROUND_TYPE` (`ID`, `NAME`, `NUM_Q_EACH_TEAM`, `FULL_MARK_EACH_Q`, `IS_MULTIPLE_CHOICE`, `IS_AUDIO_VISUAL`, `TIMER_SECONDS`, `IS_PASSABLE`) "
            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [param.RoundTypeID, param.RoundTypeName, param.NumQuestionsEachTeam, param.FullMarkEachQuestion, param.IsMCQ, param.IsAVRound, param.TimerSeconds, param.IsPassable];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, "DbHandlerMySql->createRoundTypeInstance :: Failed to Create RoundType Instance");

            logger.info(`DbHandlerMySql->createRoundTypeInstance :: RoundType Instance Successfully Created; UUID: ${param.RoundTypeID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return param.RoundTypeID;
    }

    async createRoundInstance(param: CreateParam.RoundInstance): Promise<string> {
        let roundUUID: string = uuidv4();

        const statement = "INSERT INTO `ROUND` (`UUID`, `ROUND_TYPE_ID`, `QUIZ_ID`, `SEQUENCE_NUM`) VALUES (?, ?, ?, ?)";
        const values = [roundUUID, param.RoundTypeID, param.QuizID, param.SequenceNumber];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, "DbHandlerMySql->createRoundInstance :: Failed to Create Round Instance");

            logger.info(`DbHandlerMySql->createRoundInstance :: Round Instance Successfully Created; UUID: ${roundUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return roundUUID;
    }

    async createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string> {
        let questionUUID: string = uuidv4();

        const statement = "INSERT INTO `QUESTION` (`UUID`, `DESCRIPTION`, `OPTION_1`, `OPTION_2`, `OPTION_3`, `OPTION_4`, `ANSWER`, "
            + "`MEDIA_UUID`, `ROUND_UUID`, `SEQUENCE_NUM`) "
            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [questionUUID, param.Description, param.Option1, param.Option2, param.Option3, param.Option4, param.Answer, param.MediaUUID, param.RoundUUID, param.SequenceNumber];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, "DbHandlerMySql->createQuestionInstance :: Failed to Create Question Instance");

            logger.info(`DbHandlerMySql->createQuestionInstance :: Question Instance Successfully Created; UUID: ${questionUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return questionUUID;
    }

    async updateQuizInstance(quizID: number, param: UpdateParam.QuizInstance): Promise<void> {

        let statement = "UPDATE QUIZ SET ";
        let values: any = [];

        if (param?.QuizEventName !== undefined) {
            statement += `${QuizMasterSchema.Quiz.QuizEventname} = ?,`;
            values.push(param.QuizEventName);
        }

        if (param?.StartDate !== undefined) {
            statement += `${QuizMasterSchema.Quiz.StartDateTime} = ?,`;
            values.push(param.StartDate);
        }

        if (param?.EndDate !== undefined) {
            statement += `${QuizMasterSchema.Quiz.EndDateTime} = ?,`;
            values.push(param.EndDate);
        }

        if (param?.LifecycleStatusCode !== undefined) {
            statement += `${QuizMasterSchema.Quiz.LifeycleStatusCode} = ?,`;
            values.push(param.LifecycleStatusCode);
        }

        if (param?.NumberOfRounds !== undefined) {
            statement += `${QuizMasterSchema.Quiz.NumberOfRounds} = ?,`;
            values.push(param.NumberOfRounds);
        }

        if (param?.NumberOfTeams !== undefined) {
            statement += `${QuizMasterSchema.Quiz.NumberOfTeams} = ?,`;
            values.push(param.NumberOfTeams);
        }

        if (param?.CurrentRoundSeq !== undefined) {
            statement += `${QuizMasterSchema.Quiz.CurrentRoundSeq} = ?,`;
            values.push(param.CurrentRoundSeq);
        }

        if (param?.CurrentQuestionSeq !== undefined) {
            statement += `${QuizMasterSchema.Quiz.CurrentQuestionSeq} = ?,`;
            values.push(param.CurrentQuestionSeq);
        }

        if (param?.Team1UUID !== undefined) {
            statement += `${QuizMasterSchema.Quiz.Team1UUID} = ?,`;
            values.push(param.Team1UUID);
        }

        if (param?.Team2UUID !== undefined) {
            statement += `${QuizMasterSchema.Quiz.Team2UUID} = ?,`;
            values.push(param.Team2UUID);
        }

        if (param?.Team3UUID !== undefined) {
            statement += `${QuizMasterSchema.Quiz.Team3UUID} = ?,`;
            values.push(param.Team3UUID);
        }

        if (param?.Team4UUID !== undefined) {
            statement += `${QuizMasterSchema.Quiz.Team4UUID} = ?,`;
            values.push(param.Team4UUID);
        }

        if (values.length === 0) {
            logger.info(`DbHandlerMySql->updateQuizInstance :: No Value Passed to Update Quiz: ${quizID}`);
            return;
        }

        statement = statement.slice(0, -1); // remove the last ','

        statement += " WHERE ID = ?";
        values.push(quizID);

        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, `DbHandlerMySql->updateQuizInstance :: Failed to Update Quiz ${quizID}: ${JSON.stringify(param)}`);

            logger.info(`DbHandlerMySql->updateQuizInstance :: Quiz ${quizID} Updated: ${JSON.stringify(param)}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return;
    }

    async updateMemberInstance(param: UpdateParam.MemberInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async updateTeamInstance(param: UpdateParam.TeamInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async updateRoundInstance(param: UpdateParam.RoundInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async updateQuestionInstance(param: UpdateParam.QuestionInstance): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getRoundTypes(): Promise<GetParam.RoundType[]> {
        const roundTypes: GetParam.RoundType[] = [];
        const statement: string = "SELECT * FROM ROUND_TYPE";

        try {
            let [result, fields] = await this.db_conn.execute(statement);
            let _result = JSON.parse(JSON.stringify(result));

            for (let eachRoundType of _result) {
                const roundType: GetParam.RoundType = {
                    RoundTypeID: eachRoundType.ID,
                    RoundTypeName: eachRoundType.NAME,
                    NumQuestionsEachTeam: eachRoundType.NUM_Q_EACH_TEAM,
                    FullMarkEachQuestion: eachRoundType.FULL_MARK_EACH_Q,
                    IsMCQ: eachRoundType.IS_MULTIPLE_CHOICE,
                    IsAVRound: eachRoundType.IS_AUDIO_VISUAL,
                    IsPassable: eachRoundType.IS_PASSABLE,
                    TimerSeconds: eachRoundType.TIMER_SECONDS
                }
                roundTypes.push(roundType);
            }

            logger.info(`DbHandlerMySql->getRoundTypes :: Round Types Returned: ${roundTypes.length}`);
        } catch (err) {
            logger.error(`DbHandlerMySql->getRoundTypes :: Failed to Return Round Types`, err);
            throw err;
        }
        return roundTypes;
    }

    async getRoundTypeByID(roundTypeID: string): Promise<GetParam.RoundType> {
        let roundType: GetParam.RoundType;
        const statement: string = "SELECT * FROM ROUND_TYPE WHERE ID = ?";
        const values = [roundTypeID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.length === 1, `DbHandlerMySql->getRoundTypeByID :: Failed to Return Round Type by ID`);

            roundType = {
                RoundTypeID: _result[0].ID,
                RoundTypeName: _result[0].NAME,
                NumQuestionsEachTeam: _result[0].NUM_Q_EACH_TEAM,
                FullMarkEachQuestion: _result[0].FULL_MARK_EACH_Q,
                IsMCQ: _result[0].IS_MULTIPLE_CHOICE,
                IsAVRound: _result[0].IS_AUDIO_VISUAL,
                IsPassable: _result[0].IS_PASSABLE,
                TimerSeconds: _result[0].TIMER_SECONDS
            }

            logger.info(`DbHandlerMySql->getRoundTypeByID :: Round Type by ID Returned: ${roundType.RoundTypeID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return roundType;
    }

    async getRoundsByQuizID(quizID: number): Promise<GetParam.Round[]> {
        const rounds: GetParam.Round[] = [];
        const statement: string = "SELECT * FROM ROUND WHERE QUIZ_ID = ?";
        const values = [quizID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            // assert(_result.length > 0, `DbHandlerMySql->getRoundsByQuizID :: Failed to Return Rounds`); There can be quiz with no rounds created yet

            for (let eachRound of _result) {
                const round: GetParam.Round = {
                    UUID: eachRound.UUID,
                    RoundTypeID: eachRound.ROUND_TYPE_ID,
                    SequenceNumber: eachRound.SEQUENCE_NUM
                }
                rounds.push(round);
            }

            logger.info(`DbHandlerMySql->getRoundsByQuizID :: ${rounds.length} Rounds Returned for Quiz: ${quizID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return rounds;
    }

    async getQuizByID(quizID: number): Promise<GetParam.Quiz> {
        let quiz: GetParam.Quiz;

        try {
            const statement: string = "SELECT * FROM QUIZ WHERE ID = ?";
            const values = [quizID];
            const sql = mysql.format(statement, values);

            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.length === 1, `DbHandlerMySql->getQuizByID :: Failed to Return Quiz ID ${quizID}`);

            quiz = {
                QuizEventID: _result[0].ID,
                QuizEventname: _result[0].EVENT_NAME,
                LifeycleStatusCode: _result[0].LIFECYCLE_STATUS,
                NumberOfRounds: _result[0].NUM_OF_ROUNDS,
                NumberOfTeams: _result[0].NUM_OF_TEAMS,
            } as GetParam.Quiz;

            if (!!_result[0].START_DATE_TIME) {
                quiz.StartDateTime = new Date(_result[0].START_DATE_TIME);
            }
            if (!!_result[0].END_DATE_TIME) {
                quiz.EndDateTime = new Date(_result[0].END_DATE_TIME);
            }
            if (!!_result[0].CURR_ROUND_SEQ_NUM) {
                quiz.CurrentRoundSeq = _result[0].CURR_ROUND_SEQ_NUM;
            }
            if (!!_result[0].CURR_QUESTION_SEQ_NUM) {
                quiz.CurrentQuestionSeq = _result[0].CURR_QUESTION_SEQ_NUM;
            }
            if (!!_result[0].TEAM_1_UUID) {
                quiz.Team1UUID = _result[0].TEAM_1_UUID;
            }
            if (!!_result[0].TEAM_2_UUID) {
                quiz.Team2UUID = _result[0].TEAM_2_UUID;
            }
            if (!!_result[0].TEAM_3_UUID) {
                quiz.Team3UUID = _result[0].TEAM_3_UUID;
            }
            if (!!_result[0].TEAM_4_UUID) {
                quiz.Team4UUID = _result[0].TEAM_4_UUID;
            }

            logger.info(`DbHandlerMySql->getQuizByID :: Quiz Returned: ${quiz.QuizEventname}`);

        } catch (err) {
            logger.error(err);
            throw err;
        }

        return quiz;
    }

    async getAllQuizzes(): Promise<GetParam.Quiz[]> {
        const quizzes: GetParam.Quiz[] = [];
        let quiz: GetParam.Quiz = {} as GetParam.Quiz;

        try {
            const sql: string = "SELECT * FROM QUIZ";

            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            for (let entry of _result) {
                quiz = {
                    QuizEventID: entry[QuizMasterSchema.Quiz.QuizID],
                    QuizEventname: entry[QuizMasterSchema.Quiz.QuizEventname],
                    StartDateTime: entry[QuizMasterSchema.Quiz.StartDateTime],
                    EndDateTime: entry[QuizMasterSchema.Quiz.EndDateTime],
                    LifeycleStatusCode: entry[QuizMasterSchema.Quiz.LifeycleStatusCode],
                    NumberOfRounds: entry[QuizMasterSchema.Quiz.NumberOfRounds],
                    NumberOfTeams: entry[QuizMasterSchema.Quiz.NumberOfTeams],
                    CurrentRoundSeq: entry[QuizMasterSchema.Quiz.CurrentRoundSeq],
                    CurrentQuestionSeq: entry[QuizMasterSchema.Quiz.CurrentQuestionSeq],
                    Team1UUID: entry[QuizMasterSchema.Quiz.Team1UUID],
                    Team2UUID: entry[QuizMasterSchema.Quiz.Team2UUID],
                    Team3UUID: entry[QuizMasterSchema.Quiz.Team2UUID],
                    Team4UUID: entry[QuizMasterSchema.Quiz.Team4UUID]

                };
                quizzes.push(quiz);
            }

            logger.info(`DbHandlerMySql->getAllQuizzes :: Quizzes Returned: ${quizzes.length}`);

        } catch (err) {
            logger.error(err);
            throw err;
        }

        return quizzes;
    }

    async getTeamByUUID(teamUUID: string): Promise<GetParam.Team> {
        let team: GetParam.Team;

        try {
            const statement: string = "SELECT * FROM TEAM WHERE UUID = ?";
            const values = [teamUUID];
            const sql = mysql.format(statement, values);

            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.length === 1, `DbHandlerMySql->getTeamByUUID :: Failed to Return Team UUID ${teamUUID}`);

            team = {
                TeamName: _result[0].TEAM_NAME,
                Member1: {
                    UUID: '',
                    Surname: '',
                    Name: '',
                    Lastname: ''
                },
                Member2: {
                    UUID: '',
                    Surname: '',
                    Name: '',
                    Lastname: ''
                },
                Member3: {
                    UUID: '',
                    Surname: '',
                    Name: '',
                    Lastname: ''
                },
                Member4: {
                    UUID: '',
                    Surname: '',
                    Name: '',
                    Lastname: ''
                },
            };

            let memberUUIDs = [_result[0].MEMBER_1_UUID, _result[0].MEMBER_2_UUID, _result[0].MEMBER_3_UUID, _result[0].MEMBER_4_UUID];
            let members: GetParam.Member[] = [];

            for (let memberUUID of memberUUIDs) {
                if (!memberUUID) {
                    break;
                }
                const statement: string = "SELECT * FROM MEMBER WHERE UUID = ?";
                const values = [memberUUID];
                const sql = mysql.format(statement, values);

                let [result, fields] = await this.db_conn.execute(sql);
                let _result = JSON.parse(JSON.stringify(result));

                assert(_result.length === 1, `DbHandlerMySql->getTeamByUUID :: Failed to Return Member UUID ${memberUUID}`);

                let member: GetParam.Member = {
                    UUID: _result[0].UUID,
                    Surname: _result[0].SURNAME,
                    Name: _result[0].NAME,
                    Lastname: _result[0].LASTNAME
                }

                members.push(member)
            }

            if (!!members[0]) {
                team.Member1 = members[0];
            }

            if (!!members[1]) {
                team.Member2 = members[1];
            }

            if (!!members[2]) {
                team.Member3 = members[2];
            }

            if (!!members[3]) {
                team.Member4 = members[3];
            }

            logger.info(`DbHandlerMySql->getTeamByUUID :: Team Returned: ${team.TeamName}`);

        } catch (err) {
            logger.error(err);
            throw err;
        }

        return team;
    }

    async getQuestionsByRoundUUID(roundUUID: string): Promise<GetParam.Question[]> {
        const questions: GetParam.Question[] = [];
        try {
            const statement: string = "SELECT * FROM QUESTION WHERE ROUND_UUID = ?";
            const values = [roundUUID];
            const sql = mysql.format(statement, values);

            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            for (let _question of _result) {
                const question: GetParam.Question = {
                    RoundUUID: _question.ROUND_UUID,
                    SequenceNumber: _question.SEQUENCE_NUM,
                    Description: _question.DESCRIPTION,
                    Answer: _question.ANSWER,
                    Option1: _question.OPTION_1,
                    Option2: _question.OPTION_2,
                    Option3: _question.OPTION_3,
                    Option4: _question.OPTION_4,
                    MediaUUID: _question.MEDIA_UUID,
                    TargetTeamUUID: _question.TARGET_TEAM_UUID,
                    ActualTeamUUID: _question.ACTUAL_TEAM_UUID,
                    AnswerGiven: _question.ANSWER_GIVEN,
                    ActualMarkGiven: _question.ACTUAL_MARK_GIVEN
                }
                questions.push(question);
            }

            if (questions.length) {
                logger.info(`DbHandlerMySql->getQuestionsByRoundUUID :: ${questions.length} Questions Returned for Round: ${roundUUID}`);
            } else {
                logger.info(`DbHandlerMySql->getQuestionsByRoundUUID :: No Question Found For Round UUID: ${roundUUID}`);
            }

        } catch (err) {
            logger.error(err);
            throw err;
        }
        return questions;
    }

    async deleteMemberInstance(memberUUID: string): Promise<void> {
        const statement: string = "DELETE FROM MEMBER WHERE UUID = ?";
        const values = [memberUUID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.affectedRows === 1, `DbHandlerMySql->deleteMemberInstance :: Failed to Delete Member Instance: ${memberUUID}`);

            logger.info(`DbHandlerMySql->deleteMemberInstance :: Member Instance Successfully Deleted: ${memberUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return;
    }

    async deleteTeamInstance(teamUUID: string): Promise<void> {
        try {
            const team: GetParam.Team = await this.getTeamByUUID(teamUUID);
            if (!!team.Member1.UUID) {
                await this.deleteMemberInstance(team.Member1.UUID);
            }
            if (!!team.Member2.UUID) {
                await this.deleteMemberInstance(team.Member2.UUID);
            }
            if (!!team.Member3.UUID) {
                await this.deleteMemberInstance(team.Member3.UUID);
            }
            if (!!team.Member4.UUID) {
                await this.deleteMemberInstance(team.Member4.UUID);
            }

            const statement: string = "DELETE FROM TEAM WHERE UUID = ?";
            const values = [teamUUID];
            const sql = mysql.format(statement, values);

            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.affectedRows === 1, `DbHandlerMySql->deleteTeamInstance :: Failed to Delete Team Instance: ${teamUUID}`);

            logger.info(`DbHandlerMySql->deleteTeamInstance :: Team Instance Successfully Deleted: ${teamUUID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return;
    }
}