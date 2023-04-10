import { DbHandler, CreateParam, UpdateParam, GetResponseParam, QuizStatus } from "../common";
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
        const values = [param.QuizEventName, param.NumberOfRounds, param.NumberOfTeams, QuizStatus.Draft];
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

            logger.info(`DbHandlerMySql->createRoundTypeInstance :: RoundType Instance Successfully Created; UUID: ${_result.insertId}`);
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

    async associateTeamsToQuiz(param: CreateParam.AssociateTeamsToQuiz): Promise<void> {
        const statement = "UPDATE QUIZ SET TEAM_1_UUID = ?, TEAM_2_UUID = ?, TEAM_3_UUID = ?, TEAM_4_UUID = ? WHERE ID = ?";
        const values = [param.Team1UUID, param.Team2UUID, param.Team3UUID, param.Team4UUID, param.QuizID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);

            let _result = JSON.parse(JSON.stringify(result));
            assert(_result.affectedRows === 1, `DbHandlerMySql->associateTeamsToQuiz :: Failed to Add Teams to Quiz ID: ${param.QuizID}`);

            logger.info(`DbHandlerMySql->associateTeamsToQuiz :: Teams added to Quiz ID: ${param.QuizID}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        return;
    }

    async updateQuizInstance(param: UpdateParam.QuizInstance): Promise<void> {
        throw new Error("Method not implemented.");
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

    async getRoundTypes(): Promise<GetResponseParam.RoundType[]> {
        const roundTypes: GetResponseParam.RoundType[] = [];
        const statement: string = "SELECT * FROM ROUND_TYPE";

        try {
            let [result, fields] = await this.db_conn.execute(statement);
            let _result = JSON.parse(JSON.stringify(result));

            for (let eachRoundType of _result) {
                const roundType: GetResponseParam.RoundType = {
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

    async getRoundTypeByID(roundTypeID: string): Promise<GetResponseParam.RoundType> {
        let roundType: GetResponseParam.RoundType;
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

            logger.info(`DbHandlerMySql->getRoundTypeByID :: Round Type by ID Returned: ${roundType}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return roundType;
    }

    async getRoundsByQuizID(quizID: number): Promise<GetResponseParam.Round[]> {
        const rounds: GetResponseParam.Round[] = [];
        const statement: string = "SELECT * FROM ROUND WHERE QUIZ_ID = ?";
        const values = [quizID];
        const sql = mysql.format(statement, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);
            let _result = JSON.parse(JSON.stringify(result));

            assert(_result.length > 0, `DbHandlerMySql->getRoundsByQuizID :: Failed to Return Rounds`);

            for (let eachRound of _result) {
                const round: GetResponseParam.Round = {
                    UUID: eachRound.UUID,
                    RoundTypeID: eachRound.ROUND_TYPE_ID,
                    SequenceNumber: eachRound.SEQUENCE_NUM
                }
                rounds.push(round);
            }

            logger.info(`DbHandlerMySql->getRoundsByQuizID :: Rounds Returned: ${rounds.length}`);
        } catch (err) {
            logger.error(err);
            throw err;
        }
        return rounds;
    }

}