import { Request, Response } from "express";
import { logger } from "../logger";
import { Endpoint, QuizLifecycleStatusCode } from "./constants";
import {
  IHandleDatabase,
  QuizType,
  TeamType,
  RoundType,
  QuestionType,
} from "./IHandleDatabase";

export class RequestHandler {
  private db: IHandleDatabase;

  constructor(dbHandler: IHandleDatabase) {
    this.db = dbHandler;
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const endpoint: string = req.params[0];
      logger.info("RequestHandler->handleRequest: " + endpoint);

      /**
       * GET endpoints
       */

      if (endpoint === Endpoint.get_all_quizzes) {
        const quizzes: QuizType[] = await this.getAllQuizzes();
        res.json({ Quizzes: quizzes });
      }

      if (endpoint === Endpoint.get_quiz) {
        const quizID = this.getQuizID(req, res);
        const quiz: QuizType[] = await this.db.getQuiz(quizID);
        res.json({ Quiz: quiz[0] });
      }

      if (endpoint === Endpoint.get_quiz_teams) {
        const quizID = this.getQuizID(req, res);
        const teams: TeamType[] = await this.db.getTeamsByQuizID(quizID);
        res.json({ Teams: teams });
      }

      if (endpoint === Endpoint.get_quiz_rounds) {
        const quizID = this.getQuizID(req, res);
        const rounds: RoundType[] = await this.db.getRoundsByQuizID(quizID);
        res.json({ Rounds: rounds });
      }

      if (endpoint === Endpoint.get_quiz_round_questions) {
        const roundUUID = req.query.roundUUID as string;
        if (!roundUUID) {
          res.status(404).send("Invalid round UUID: " + req.query.roundUUID);
        }
        const questions: QuestionType[] = await this.db.getQuestionsByRoundUUID(
          roundUUID
        );
        res.json({ Questions: questions });
      }

      /**
       * CREATE endpoints
       */

      if (endpoint === Endpoint.create_quiz) {
        const quiz: QuizType = req.body.Quiz;
        const quizID: number = await this.db.createQuiz(quiz);
        res.json({ QuizID: quizID });
      }

      if (endpoint === Endpoint.create_quiz_teams) {
        const quizID: number = req.body.QuizID;
        const teams: TeamType[] = req.body.Teams;
        const quiz: QuizType[] = await this.db.getQuiz(quizID);
        if (quiz.length === 0) {
          res.status(400).send("Invalid quiz ID: " + req.body.QuizID);
        }
        if (teams?.length) {
          res.status(200).send("No value for Teams provided");
        }
        await this.createQuizTeams(quizID, teams);
        res.status(201).send("Created teams");
      }

      if (endpoint === Endpoint.create_quiz_rounds) {
        const rounds: RoundType[] = req.body.Rounds;
        for (const round of rounds) {
          await this.db.createRound(round);
        }
        res.status(201).send("Created rounds");
      }

      if (endpoint === Endpoint.create_quiz_round_questions) {
        const questions: QuestionType[] = req.body.Questions;
        const files = req.files as object;
        const media: Express.Multer.File[] = [];
        Object.keys(files).forEach(function (key) {
          // media.push(files[key as keyof Request["files"]]);
          media.push(files[key as keyof typeof files]);
        });

        for (const question of questions) {
          const file: Express.Multer.File | undefined = media.find(
            (x: Express.Multer.File) =>
              parseInt(x.originalname) === question.SequenceNumber
          );
          const mediaBase64 = file?.buffer
            ? Buffer.from(file.buffer).toString("base64")
            : "";

          question.MediaBase64 = mediaBase64;
          await this.db.createQuestion(question);
        }

        res.status(201).send("Created questions");
      }

      /**
       * EDIT endpoints
       */
    } catch (error) {
      logger.error("RequestHandler->handleRequest: " + req.params[0], error);
      res.status(500).send("Error occurred: " + JSON.stringify(error));
    }
  }

  private getQuizID(req: Request, res: Response): number {
    const _id = req.query.quizID as string;
    const id = parseInt(_id);
    if (Number.isNaN(id)) {
      res.status(404).send("Invalid quiz ID: " + req.query.quizID);
    }
    return id;
  }

  private async getAllQuizzes(): Promise<QuizType[]> {
    const quizzes: QuizType[] = await this.db.getQuiz();

    // Sort descending by quiz ID
    const sorted = quizzes.sort((x, y) => {
      // to suppress error: 'x.ID' is possibly 'undefined'
      if (!x?.ID || !y.ID) {
        return 1;
      }
      if (x.ID < y.ID) {
        return 1;
      } else {
        return -1;
      }
    });
    return sorted;
  }

  private async createQuizTeams(
    quizID: number,
    teams: TeamType[]
  ): Promise<void> {
    const teamUUIDs: string[] = [];
    for (let i = 0; i < 4; i++) {
      if (teams[i]) {
        teamUUIDs.push(await this.db.createTeam(teams[i]));
      }
    }

    const quiz: QuizType = {
      ID: quizID,
    };

    if (teamUUIDs[0]) {
      quiz.Team1UUID = teamUUIDs[0];
    }
    if (teamUUIDs[1]) {
      quiz.Team2UUID = teamUUIDs[1];
    }
    if (teamUUIDs[2]) {
      quiz.Team3UUID = teamUUIDs[2];
    }
    if (teamUUIDs[3]) {
      quiz.Team4UUID = teamUUIDs[3];
    }

    await this.db.updateQuiz(quiz);
  }
}
