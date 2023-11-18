import * as schema from "./TableSchema";
import {
  IHandleDatabase,
  QuizType,
  TeamType,
  RoundType,
  QuestionType,
} from "./IHandleDatabase";
import * as mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger";
import dotenv from "dotenv";

export class MySqlDbHandler implements IHandleDatabase {
  private static instance: MySqlDbHandler;
  private db_conn!: mysql.Connection;

  static async getInstance(): Promise<IHandleDatabase> {
    if (!this.instance) {
      this.instance = new MySqlDbHandler();

      dotenv.config();
      const HOST = "localhost";
      const USER = process.env.MYSQL_USER;
      const PASS = process.env.MYSQL_PASS;
      const DB = process.env.MYSQL_DB;

      this.instance.db_conn = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASS,
        database: DB,
      });
    }

    return this.instance;
  }

  async createQuiz(quiz: QuizType): Promise<number> {
    try {
      const statement =
        `INSERT INTO ${schema.Table.Quiz} ` +
        `(${schema.Quiz.QuizEventname}, ${schema.Quiz.NumberOfRounds}, ${schema.Quiz.NumberOfTeams}, ${schema.Quiz.LifeycleStatusCode})  ` +
        "VALUES (?, ?, ?, ?)";
      const values = [
        quiz.QuizEventName,
        quiz.NumberOfRounds,
        quiz.NumberOfTeams,
        quiz.LifecycleStatusCode,
      ];
      const sql = mysql.format(statement, values);
      const [result] = await this.db_conn.execute(sql);

      const _result = JSON.parse(JSON.stringify(result));
      const quizID: number = _result.insertId;

      logger.info(
        "MySqlDbHandler->createQuiz :: Created quiz: " + JSON.stringify(quiz)
      );

      return quizID;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->createQuiz :: Failed to create quiz: " +
          JSON.stringify(quiz),
        error
      );
      throw error;
    }
  }

  async createTeam(team: TeamType): Promise<string> {
    try {
      const teamUUID: string = uuidv4();
      const statement =
        `INSERT INTO ${schema.Table.Team} ` +
        `(${schema.Team.UUID}, ${schema.Team.TeamName}, ${schema.Team.Member1Name}, ${schema.Team.Member2Name}, ${schema.Team.Member3Name}, ${schema.Team.Member4Name}) ` +
        "VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        teamUUID,
        team.TeamName,
        team.Member1Name,
        team.Member2Name,
        team.Member3Name,
        team.Member4Name,
      ];
      const sql = mysql.format(statement, values);
      await this.db_conn.execute(sql);
      logger.info(
        "MySqlDbHandler->createTeam :: Created team: " + JSON.stringify(team)
      );
      return teamUUID;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->createTeam :: Failed to create team:" +
          JSON.stringify(team),
        error
      );
      throw error;
    }
  }

  async createRound(round: RoundType): Promise<string> {
    try {
      const roundUUID: string = uuidv4();
      const statement =
        `INSERT INTO ${schema.Table.Round} ` +
        `(${schema.Round.UUID}, ${schema.Round.QuizID}, ${schema.Round.RoundName}, ${schema.Round.SequenceNumber}, ${schema.Round.NumQuestionsEachTeam}, 
          ${schema.Round.FullMarkEachQuestion},${schema.Round.IsMCQ},${schema.Round.IsAudioVisualRound},${schema.Round.IsPassable},${schema.Round.TimerSeconds}) ` +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        roundUUID,
        round.QuizID,
        round.RoundName,
        round.SequenceNumber,
        round.NumQuestionsEachTeam,
        round.FullMarkEachQuestion,
        round.IsMCQ,
        round.IsAudioVisualRound,
        round.IsPassable,
        round.TimerSeconds,
      ];
      const sql = mysql.format(statement, values);
      await this.db_conn.execute(sql);
      logger.info(
        "MySqlDbHandler->createRound :: Created round: " + JSON.stringify(round)
      );
      return roundUUID;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->createRound :: Failed to create round: " +
          JSON.stringify(round),
        error
      );
      throw error;
    }
  }

  async createQuestion(question: QuestionType): Promise<string> {
    try {
      const questionUUID: string = uuidv4();

      const statement =
        `INSERT INTO ${schema.Table.Question} ` +
        `(${schema.Question.UUID}, ${schema.Question.RoundUUID}, ${schema.Question.SequenceNumber}, ${schema.Question.Description}, ${schema.Question.Option1}, 
        ${schema.Question.Option2},${schema.Question.Option3},${schema.Question.Option4},${schema.Question.Answer},${schema.Question.MediaBase64}) ` +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        questionUUID,
        question.RoundUUID,
        question.SequenceNumber,
        question.Description,
        question.Option1,
        question.Option2,
        question.Option3,
        question.Option4,
        question.Answer,
        question.MediaBase64,
      ];
      const sql = mysql.format(statement, values);
      await this.db_conn.execute(sql);

      delete question.MediaBase64; // Omit media binary from logging

      logger.info(
        "MySqlDbHandler->createQuestion :: Created question: " +
          JSON.stringify(question)
      );
      return questionUUID;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->createQuestion :: Failed to create question: " +
          JSON.stringify(question),
        error
      );
      throw error;
    }
  }

  async updateQuiz(quiz: QuizType): Promise<void> {
    let statement = `UPDATE ${schema.Table.Quiz} SET `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (quiz.QuizEventName !== undefined) {
      statement += `${schema.Quiz.QuizEventname} = ?,`;
      values.push(quiz.QuizEventName);
    }

    if (quiz.StartDateTime !== undefined) {
      statement += `${schema.Quiz.StartDateTime} = ?,`;
      values.push(quiz.StartDateTime);
    }

    if (quiz.EndDateTime !== undefined) {
      statement += `${schema.Quiz.EndDateTime} = ?,`;
      values.push(quiz.EndDateTime);
    }

    if (quiz.LifecycleStatusCode !== undefined) {
      statement += `${schema.Quiz.LifeycleStatusCode} = ?,`;
      values.push(quiz.LifecycleStatusCode);
    }

    if (quiz.NumberOfRounds !== undefined) {
      statement += `${schema.Quiz.NumberOfRounds} = ?,`;
      values.push(quiz.NumberOfRounds);
    }

    if (quiz.NumberOfTeams !== undefined) {
      statement += `${schema.Quiz.NumberOfTeams} = ?,`;
      values.push(quiz.NumberOfTeams);
    }

    if (quiz.CurrentRoundSeq !== undefined) {
      statement += `${schema.Quiz.CurrentRoundSeq} = ?,`;
      values.push(quiz.CurrentRoundSeq);
    }

    if (quiz.CurrentQuestionSeq !== undefined) {
      statement += `${schema.Quiz.CurrentQuestionSeq} = ?,`;
      values.push(quiz.CurrentQuestionSeq);
    }

    if (quiz.Team1UUID !== undefined) {
      statement += `${schema.Quiz.Team1UUID} = ?,`;
      values.push(quiz.Team1UUID);
    }

    if (quiz.Team2UUID !== undefined) {
      statement += `${schema.Quiz.Team2UUID} = ?,`;
      values.push(quiz.Team2UUID);
    }

    if (quiz.Team3UUID !== undefined) {
      statement += `${schema.Quiz.Team3UUID} = ?,`;
      values.push(quiz.Team3UUID);
    }

    if (quiz.Team4UUID !== undefined) {
      statement += `${schema.Quiz.Team4UUID} = ?,`;
      values.push(quiz.Team4UUID);
    }

    if (values.length === 0) {
      return;
    }

    statement = statement.slice(0, -1); // Remove the last ','

    statement += " WHERE ID = ?";
    values.push(quiz.ID);

    const sql = mysql.format(statement, values);

    try {
      await this.db_conn.execute(sql);

      // const [result] = await this.db_conn.execute(sql);
      // const _result = JSON.parse(JSON.stringify(result));
      // assert(
      //   _result.affectedRows === 1,
      //   "MySqlDbHandler->updateQuiz :: Failed to update Quiz: " +
      //     JSON.stringify(quiz)
      // );

      logger.info(
        "MySqlDbHandler->updateQuiz :: Updated quiz: " + JSON.stringify(quiz)
      );
    } catch (error) {
      logger.error(
        "MySqlDbHandler->updateQuiz :: Failed to update Quiz: " +
          JSON.stringify(quiz),
        error
      );
      throw error;
    }
  }

  async updateTeam(team: TeamType): Promise<void> {
    let statement = `UPDATE ${schema.Table.Team} SET `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (team.TeamName !== undefined) {
      statement += `${schema.Team.TeamName} = ?,`;
      values.push(team.TeamName);
    }
    if (team.TotalMark !== undefined) {
      statement += `${schema.Team.TotalMark} = ?,`;
      values.push(team.TotalMark);
    }
    if (team.Member1Name !== undefined) {
      statement += `${schema.Team.Member1Name} = ?,`;
      values.push(team.Member1Name);
    }
    if (team.Member2Name !== undefined) {
      statement += `${schema.Team.Member2Name} = ?,`;
      values.push(team.Member2Name);
    }
    if (team.Member3Name !== undefined) {
      statement += `${schema.Team.Member3Name} = ?,`;
      values.push(team.Member3Name);
    }
    if (team.Member4Name !== undefined) {
      statement += `${schema.Team.Member4Name} = ?,`;
      values.push(team.Member4Name);
    }
    if (values.length === 0) {
      return;
    }

    statement = statement.slice(0, -1); // Remove the last ','

    statement += " WHERE UUID = ?";
    values.push(team.UUID);

    const sql = mysql.format(statement, values);

    try {
      await this.db_conn.execute(sql);

      logger.info(
        "MySqlDbHandler->updateTeam :: Updated team: " + JSON.stringify(team)
      );
    } catch (error) {
      logger.error(
        "MySqlDbHandler->updateTeam :: Failed to update team: " +
          JSON.stringify(team),
        error
      );
      throw error;
    }
  }

  async updateRound(round: RoundType): Promise<void> {
    let statement = `UPDATE ${schema.Table.Round} SET `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (round.RoundName !== undefined) {
      statement += `${schema.Round.RoundName} = ?,`;
      values.push(round.RoundName);
    }
    if (round.SequenceNumber !== undefined) {
      statement += `${schema.Round.SequenceNumber} = ?,`;
      values.push(round.SequenceNumber);
    }
    if (round.NumQuestionsEachTeam !== undefined) {
      statement += `${schema.Round.NumQuestionsEachTeam} = ?,`;
      values.push(round.NumQuestionsEachTeam);
    }
    if (round.FullMarkEachQuestion !== undefined) {
      statement += `${schema.Round.FullMarkEachQuestion} = ?,`;
      values.push(round.FullMarkEachQuestion);
    }
    if (round.IsMCQ !== undefined) {
      statement += `${schema.Round.IsMCQ} = ?,`;
      values.push(round.IsMCQ);
    }
    if (round.IsAudioVisualRound !== undefined) {
      statement += `${schema.Round.IsAudioVisualRound} = ?,`;
      values.push(round.IsAudioVisualRound);
    }
    if (round.IsPassable !== undefined) {
      statement += `${schema.Round.IsPassable} = ?,`;
      values.push(round.IsPassable);
    }
    if (round.TimerSeconds !== undefined) {
      statement += `${schema.Round.TimerSeconds} = ?,`;
      values.push(round.TimerSeconds);
    }

    if (values.length === 0) {
      return;
    }

    statement = statement.slice(0, -1); // Remove the last ','

    statement += " WHERE UUID = ?";
    values.push(round.UUID);

    const sql = mysql.format(statement, values);

    try {
      await this.db_conn.execute(sql);

      logger.info(
        "MySqlDbHandler->updateRound :: Updated round: " + JSON.stringify(round)
      );
    } catch (error) {
      logger.error(
        "MySqlDbHandler->updateRound :: Failed to update round: " +
          JSON.stringify(round),
        error
      );
      throw error;
    }
  }

  async updateQuestion(question: QuestionType): Promise<void> {
    let statement = `UPDATE ${schema.Table.Question} SET `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = [];

    if (question.Description !== undefined) {
      statement += `${schema.Question.Description} = ?,`;
      values.push(question.Description);
    }
    if (question.Option1 !== undefined) {
      statement += `${schema.Question.Option1} = ?,`;
      values.push(question.Option1);
    }
    if (question.Option2 !== undefined) {
      statement += `${schema.Question.Option2} = ?,`;
      values.push(question.Option2);
    }
    if (question.Option3 !== undefined) {
      statement += `${schema.Question.Option3} = ?,`;
      values.push(question.Option3);
    }
    if (question.Option4 !== undefined) {
      statement += `${schema.Question.Option4} = ?,`;
      values.push(question.Option4);
    }
    if (question.Answer !== undefined) {
      statement += `${schema.Question.Answer} = ?,`;
      values.push(question.Answer);
    }
    if (question.MediaBase64 !== undefined) {
      statement += `${schema.Question.MediaBase64} = ?,`;
      values.push(question.MediaBase64);
    }
    if (question.TargetTeamUUID !== undefined) {
      statement += `${schema.Question.TargetTeamUUID} = ?,`;
      values.push(question.TargetTeamUUID);
    }
    if (question.ActualTeamUUID !== undefined) {
      statement += `${schema.Question.ActualTeamUUID} = ?,`;
      values.push(question.ActualTeamUUID);
    }
    if (question.ActualMarkGiven !== undefined) {
      statement += `${schema.Question.ActualMarkGiven} = ?,`;
      values.push(question.ActualMarkGiven);
    }
    if (question.AnswerGiven !== undefined) {
      statement += `${schema.Question.AnswerGiven} = ?,`;
      values.push(question.AnswerGiven);
    }

    if (values.length === 0) {
      return;
    }

    statement = statement.slice(0, -1); // Remove the last ','

    statement += " WHERE UUID = ?";
    values.push(question.UUID);

    const sql = mysql.format(statement, values);

    try {
      await this.db_conn.execute(sql);
      delete question.MediaBase64; // Omit from logging

      logger.info(
        "MySqlDbHandler->updateQuestion :: Updated question: " +
          JSON.stringify(question)
      );
    } catch (error) {
      logger.error(
        "MySqlDbHandler->updateQuestion :: Failed to update question: " +
          JSON.stringify(question),
        error
      );
      throw error;
    }
  }

  async getQuiz(quizID?: number): Promise<QuizType[]> {
    try {
      const quizzes: QuizType[] = [];
      let sql: string;
      if (quizID) {
        const statement = `SELECT * FROM ${schema.Table.Quiz} WHERE ID = ?`;
        const values = [quizID];
        sql = mysql.format(statement, values);
      } else {
        sql = `SELECT * FROM ${schema.Table.Quiz}`;
      }
      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      for (const quiz of result) {
        quizzes.push({
          ID: quiz[schema.Quiz.QuizID],
          QuizEventName: quiz[schema.Quiz.QuizEventname],
          StartDateTime: quiz[schema.Quiz.StartDateTime],
          EndDateTime: quiz[schema.Quiz.EndDateTime],
          LifecycleStatusCode: quiz[schema.Quiz.LifeycleStatusCode],
          NumberOfRounds: quiz[schema.Quiz.NumberOfRounds],
          NumberOfTeams: quiz[schema.Quiz.NumberOfTeams],
          CurrentRoundSeq: quiz[schema.Quiz.CurrentRoundSeq],
          CurrentQuestionSeq: quiz[schema.Quiz.CurrentQuestionSeq],
          Team1UUID: quiz[schema.Quiz.Team1UUID],
          Team2UUID: quiz[schema.Quiz.Team2UUID],
          Team3UUID: quiz[schema.Quiz.Team2UUID],
          Team4UUID: quiz[schema.Quiz.Team4UUID],
        });
      }
      logger.info("MySqlDbHandler->getQuiz :: Read quiz: " + quizzes.length);
      return quizzes;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getQuiz :: Failed to read quiz: " + quizID,
        error
      );
      throw error;
    }
  }

  async getTeamsByQuizID(quizID: number): Promise<TeamType[]> {
    try {
      const teams: TeamType[] = [];
      const quiz: QuizType = (await this.getQuiz(quizID))[0];
      if (quiz.Team1UUID) {
        teams.push(await this.getTeamByUUID(quiz.Team1UUID));
      }
      if (quiz.Team2UUID) {
        teams.push(await this.getTeamByUUID(quiz.Team2UUID));
      }
      if (quiz.Team3UUID) {
        teams.push(await this.getTeamByUUID(quiz.Team3UUID));
      }
      if (quiz.Team4UUID) {
        teams.push(await this.getTeamByUUID(quiz.Team4UUID));
      }

      logger.info(
        "MySqlDbHandler->getTeamsByQuizID :: Read teams of quiz: " +
          JSON.stringify(teams)
      );

      return teams;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getTeamsByQuizID :: Failed to read teams of quiz: " +
          quizID,
        error
      );
      throw error;
    }
  }

  async getTeamByUUID(teamUUID: string): Promise<TeamType> {
    try {
      const statement = `SELECT * FROM ${schema.Table.Team} WHERE UUID = ?`;
      const values = [teamUUID];
      const sql = mysql.format(statement, values);

      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      const team: TeamType = {
        UUID: result[0][schema.Team.UUID],
        TeamName: result[0][schema.Team.TeamName],
        Member1Name: result[0][schema.Team.Member1Name],
        Member2Name: result[0][schema.Team.Member2Name],
        Member3Name: result[0][schema.Team.Member3Name],
        Member4Name: result[0][schema.Team.Member4Name],
        TotalMark: result[0][schema.Team.TotalMark],
      };

      logger.info(
        "MySqlDbHandler->getTeamByUUID :: Read team: " + JSON.stringify(team)
      );

      return team;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getTeamByUUID :: Failed to read team: " + teamUUID,
        error
      );
      throw error;
    }
  }

  async getRoundsByQuizID(quizID: number): Promise<RoundType[]> {
    try {
      const rounds: RoundType[] = [];
      const statement = `SELECT * FROM ${schema.Table.Round} WHERE ${schema.Round.QuizID} = ?`;
      const values = [quizID];
      const sql = mysql.format(statement, values);
      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      for (const round of result) {
        rounds.push({
          UUID: round[schema.Round.UUID],
          QuizID: round[schema.Round.QuizID],
          RoundName: round[schema.Round.RoundName],
          SequenceNumber: round[schema.Round.SequenceNumber],
          NumQuestionsEachTeam: round[schema.Round.NumQuestionsEachTeam],
          FullMarkEachQuestion: round[schema.Round.FullMarkEachQuestion],
          IsMCQ: round[schema.Round.IsMCQ],
          IsAudioVisualRound: round[schema.Round.IsAudioVisualRound],
          IsPassable: round[schema.Round.IsPassable],
          TimerSeconds: round[schema.Round.TimerSeconds],
        });
      }

      logger.info(
        "MySqlDbHandler->getRoundsByQuizID :: Read rounds of quiz: " +
          JSON.stringify(rounds)
      );

      return rounds;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getRoundsByQuizID :: Failed to read rounds of quiz: " +
          quizID,
        error
      );
      throw error;
    }
  }

  async getRoundByUUID(roundUUID: string): Promise<RoundType> {
    try {
      const statement = `SELECT * FROM ${schema.Table.Round} WHERE ${schema.Round.UUID} = ?`;
      const values = [roundUUID];
      const sql = mysql.format(statement, values);

      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      const round: RoundType = {
        UUID: result[0][schema.Round.UUID],
        QuizID: result[0][schema.Round.UUID],
        RoundName: result[0][schema.Round.UUID],
        SequenceNumber: result[0][schema.Round.UUID],
        NumQuestionsEachTeam: result[0][schema.Round.UUID],
        FullMarkEachQuestion: result[0][schema.Round.UUID],
        IsMCQ: result[0][schema.Round.UUID],
        IsAudioVisualRound: result[0][schema.Round.UUID],
        IsPassable: result[0][schema.Round.UUID],
        TimerSeconds: result[0][schema.Round.UUID],
      };

      logger.info(
        "MySqlDbHandler->getRoundByUUID :: Read round: " + JSON.stringify(round)
      );

      return round;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getRoundByUUID :: Failed to read round: " + roundUUID,
        error
      );
      throw error;
    }
  }

  async getQuestionsByRoundUUID(roundUUID: string): Promise<QuestionType[]> {
    try {
      const questions: QuestionType[] = [];
      const statement = `SELECT * FROM ${schema.Table.Question} WHERE ${schema.Question.RoundUUID} = ?`;
      const values = [roundUUID];
      const sql = mysql.format(statement, values);

      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      for (const question of result) {
        const blob = question[schema.Question.MediaBase64];
        let mediaBase64 = "";
        if (blob !== null) {
          mediaBase64 = Buffer.from(blob).toString("utf-8");
        }

        questions.push({
          UUID: question[schema.Question.UUID],
          SequenceNumber: question[schema.Question.SequenceNumber],
          Description: question[schema.Question.Description],
          Option1: question[schema.Question.Option1],
          Option2: question[schema.Question.Option2],
          Option3: question[schema.Question.Option3],
          Option4: question[schema.Question.Option4],
          Answer: question[schema.Question.Answer],
          RoundUUID: question[schema.Question.RoundUUID],
          MediaBase64: mediaBase64,
          TargetTeamUUID: question[schema.Question.TargetTeamUUID],
          ActualTeamUUID: question[schema.Question.ActualTeamUUID],
          AnswerGiven: question[schema.Question.AnswerGiven],
          ActualMarkGiven: question[schema.Question.ActualMarkGiven],
        });
      }

      logger.info(
        "MySqlDbHandler->getQuestionsByRoundUUID :: Read questions of round: " +
          JSON.stringify(questions)
      );

      return questions;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getQuestionsByRoundUUID :: Failed to read questions of round: " +
          roundUUID,
        error
      );
      throw error;
    }
  }

  async getQuestionByUUID(questionUUID: string): Promise<QuestionType> {
    try {
      const statement = `SELECT * FROM ${schema.Table.Question} WHERE ${schema.Question.UUID} = ?`;
      const values = [questionUUID];
      const sql = mysql.format(statement, values);

      const [_result] = await this.db_conn.execute(sql);
      const result = JSON.parse(JSON.stringify(_result));

      const blob = result[0][schema.Question.MediaBase64];
      let mediaBase64 = "";
      if (blob !== null) {
        mediaBase64 = Buffer.from(blob).toString("utf-8");
      }

      const question: QuestionType = {
        UUID: result[0][schema.Question.UUID],
        SequenceNumber: result[0][schema.Question.SequenceNumber],
        Description: result[0][schema.Question.Description],
        Option1: result[0][schema.Question.Option1],
        Option2: result[0][schema.Question.Option2],
        Option3: result[0][schema.Question.Option3],
        Option4: result[0][schema.Question.Option4],
        Answer: result[0][schema.Question.Answer],
        RoundUUID: result[0][schema.Question.RoundUUID],
        MediaBase64: mediaBase64,
        TargetTeamUUID: result[0][schema.Question.TargetTeamUUID],
        ActualTeamUUID: result[0][schema.Question.ActualTeamUUID],
        AnswerGiven: result[0][schema.Question.AnswerGiven],
        ActualMarkGiven: result[0][schema.Question.ActualMarkGiven],
      };

      logger.info(
        "MySqlDbHandler->getQuestionByUUID :: Read question: " +
          JSON.stringify(question)
      );

      return question;
    } catch (error) {
      logger.error(
        "MySqlDbHandler->getQuestionByUUID :: Failed to read question: " +
          questionUUID,
        error
      );
      throw error;
    }
  }

  async deleteTeam(teamUUID: string): Promise<void> {
    try {
      const statement = `DELETE FROM ${schema.Table.Team} WHERE ${schema.Team.UUID} = ?`;
      const values = [teamUUID];
      const sql = mysql.format(statement, values);

      await this.db_conn.execute(sql);

      logger.info(`MySqlDbHandler->deleteTeam :: Deleted team: ${teamUUID}`);
    } catch (error) {
      logger.error(
        "MySqlDbHandler->deleteTeam :: Failed to delete team: " + teamUUID,
        error
      );
      throw error;
    }
  }
}
