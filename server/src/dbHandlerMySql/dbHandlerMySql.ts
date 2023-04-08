import { DbHandler, CreateParam, UpdateParam, QuizStatus } from "../common";
import * as mysql from 'mysql2/promise';
import logger from "../logger";

class DbHandlerMySql extends DbHandler {
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
        let quizID: number = 1;

        const statment = "INSERT INTO `QUIZ` (`EVENT_NAME`, `NUM_OF_ROUNDS`, `NUM_OF_TEAMS`, `LIFECYCLE_STATUS`) VALUES (?, ?, ?, ?)";
        const values = [param.QuizEventName, param.NumberOfTeams, param.NumberOfRounds, QuizStatus.Draft];
        const sql = mysql.format(statment, values);

        try {
            let [result, fields] = await this.db_conn.execute(sql);
            
            let _result = JSON.parse(JSON.stringify(result));
            quizID = _result?.insertId;
            
            logger.info(`DbHandlerMySql=>createQuizInstance :: Quiz Instance Successfully Created; ID: ${_result?.insertId}`);
        } catch (err) {
            logger.error("DbHandlerMySql=>createQuizInstance :: Failed to Create Quiz Instance");
            logger.error(err);
            throw err;
        }

        return quizID;
    }

    async createMemberInstance(param: CreateParam.MemberInstance): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async createTeamInstance(param: CreateParam.TeamInstance): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async createRoundTypeInstance(param: CreateParam.RoundTypeInstance): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async createRoundInstance(param: CreateParam.RoundInstance): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async createQuestionInstance(param: CreateParam.QuestionInstance): Promise<string> {
        throw new Error("Method not implemented.");
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

}

export { DbHandlerMySql }