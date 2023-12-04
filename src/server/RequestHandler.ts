import { Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import File = Express.Multer.File;
import { logger } from "./logger.js";
import { Endpoint, MediaType, QuizLifecycleStatusCode } from "./constants.js";
import {
  IHandleDatabase,
  QuizType,
  TeamType,
  RoundType,
  QuestionType,
} from "./IHandleDatabase.js";

export default class RequestHandler {
  private db: IHandleDatabase;

  constructor(dbHandler: IHandleDatabase) {
    this.db = dbHandler;
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    const endpoint: string = req.params[0];
    try {
      logger.info("RequestHandler->handleRequest: " + req.originalUrl);

      switch (endpoint) {
        /**
         * GET endpoints
         */
        case Endpoint.get_all_quizzes: {
          const quizzes: QuizType[] = await this.db.getQuiz();
          res.json({ Quizzes: quizzes });
          break;
        }
        case Endpoint.get_quiz: {
          const quizID = this.getQuizID(req, res);
          const quiz: QuizType[] = await this.db.getQuiz(quizID);
          res.json({ Quiz: quiz[0] });
          break;
        }
        case Endpoint.get_quiz_teams: {
          const quizID = this.getQuizID(req, res);
          const teams: TeamType[] = await this.db.getTeamsByQuizID(quizID);
          res.json({ Teams: teams });
          break;
        }
        case Endpoint.get_quiz_rounds: {
          const quizID = this.getQuizID(req, res);
          const rounds: RoundType[] = await this.db.getRoundsByQuizID(quizID);
          res.json({ Rounds: rounds });
          break;
        }
        case Endpoint.get_quiz_round_questions: {
          const roundUUID = req.query.roundUUID as string;
          if (!roundUUID) {
            res.status(404).send("Invalid round UUID: " + req.query.roundUUID);
            break;
          }
          const questions: QuestionType[] =
            await this.db.getQuestionsByRoundUUID(roundUUID);
          await this.fillMediaType(questions);
          res.json({ Questions: questions });
          break;
        }
        /**
         * CREATE endpoints
         */
        case Endpoint.create_quiz: {
          const quiz: QuizType = req.body.Quiz;
          const quizID: number = await this.db.createQuiz(quiz);
          res.json({ QuizID: quizID });
          break;
        }
        case Endpoint.create_quiz_teams: {
          const teams: TeamType[] = req.body.Teams || [];
          if (!teams.length) {
            res.status(200).send("No value for Teams provided");
            break;
          }
          for (const team of teams) {
            await this.db.createTeam(team);
          }
          res.status(201).send("Created teams");
          break;
        }
        case Endpoint.create_quiz_rounds: {
          const rounds: RoundType[] = req.body.Rounds || [];
          if (!rounds.length) {
            res.status(200).send("No value for Rounds provided");
            break;
          }
          for (const round of rounds) {
            await this.db.createRound(round);
          }
          res.status(201).send("Created rounds");
          break;
        }
        case Endpoint.create_quiz_round_questions: {
          const questions: QuestionType[] =
            JSON.parse(req.body.Questions) || [];
          if (!questions.length) {
            res.status(200).send("No value for Questions provided");
            break;
          }

          const media: File[] = [];
          const files = req.files as object;
          Object.keys(files).forEach(function (key) {
            // media.push(files[key as keyof Request["files"]]);
            media.push(files[key as keyof typeof files]);
          });

          for (const question of questions) {
            const file: File | undefined = media.find(
              (x: File) => parseInt(x.originalname) === question.SequenceNumber
            );
            if (file) {
              const mediaBase64 = file?.buffer
                ? Buffer.from(file.buffer).toString("base64")
                : "";
              question.MediaBase64 = mediaBase64;
            }
            await this.db.createQuestion(question);
          }

          res.status(201).send("Created questions");
          break;
        }
        /**
         * EDIT endpoints
         */
        case Endpoint.edit_quiz: {
          const quiz: QuizType = req.body.Quiz;
          await this.db.updateQuiz(quiz);
          res.status(204).send("Updated quiz");
          break;
        }
        case Endpoint.edit_quiz_teams: {
          const teams: TeamType[] = req.body.Teams || [];
          if (!teams.length) {
            res.status(200).send("No value for Teams provided");
            break;
          }
          for (const team of teams) {
            await this.db.updateTeam(team);
          }
          res.status(204).send("Updated teams");
          break;
        }
        case Endpoint.edit_quiz_rounds: {
          const rounds: RoundType[] = req.body.Rounds || [];
          if (!rounds.length) {
            res.status(200).send("No value for Rounds provided");
            break;
          }
          for (const round of rounds) {
            await this.db.updateRound(round);
          }
          res.status(204).send("Updated rounds");
          break;
        }
        case Endpoint.edit_quiz_round_questions: {
          const questions: QuestionType[] =
            JSON.parse(req.body.Questions) || [];
          if (!questions.length) {
            res.status(200).send("No value for Questions provided");
            break;
          }
          const files = req.files as object;
          const media: File[] = [];
          Object.keys(files).forEach(function (key) {
            // media.push(files[key as keyof Request["files"]]);
            media.push(files[key as keyof typeof files]);
          });

          for (const question of questions) {
            const file: File | undefined = media.find(
              (x: File) => parseInt(x.originalname) === question.SequenceNumber
            );
            if (file) {
              const mediaBase64 = file?.buffer
                ? Buffer.from(file.buffer).toString("base64")
                : "";
              question.MediaBase64 = mediaBase64;
            }
            await this.db.updateQuestion(question);
          }

          res.status(204).send("Updated questions");
          break;
        }
        /**
         * Quiz status endpoint
         */
        case Endpoint.set_quiz_status: {
          const quizID: number = req.body.QuizID;
          const status: QuizLifecycleStatusCode =
            req.body.QuizLifecycleStatusCode;
          const quiz: QuizType = { ID: quizID, LifecycleStatusCode: status };
          await this.db.updateQuiz(quiz);
          res.status(204).send("Updated quiz status");
          break;
        }
        /**
         * Quiz progress endpoint
         */

        case Endpoint.record_quiz_progress: {
          const quizID: number = req.body.QuizID;
          const currentRoundSeq: number = req.body.CurrentRoundSeq;
          const currentQuestionSeq: number = req.body.CurrentQuestionSeq;
          const quiz: QuizType = {
            ID: quizID,
            CurrentRoundSeq: currentRoundSeq,
            CurrentQuestionSeq: currentQuestionSeq,
          };
          await this.db.updateQuiz(quiz);
          res.status(204).send("Updated quiz progress");
          break;
        }
        case Endpoint.record_team_response: {
          const questionUUID: string = req.body.QuestionUUID;
          const actualTeamUUID: string = req.body.ActualTeamUUID;
          const actualMarkGiven: number = req.body.ActualMarkGiven;
          const answerGiven: string = req.body.AnswerGiven;
          const question: QuestionType = {
            UUID: questionUUID,
            ActualTeamUUID: actualTeamUUID,
            ActualMarkGiven: actualMarkGiven,
            AnswerGiven: answerGiven,
          };
          await this.db.updateQuestion(question);
          res.status(204).send("Recorded question response");
          break;
        }
        default: {
          logger.error(
            "RequestHandler->handleRequest :: Invalid endpoint: " + endpoint
          );
          res.status(404).send("Invalid endpoint: " + endpoint);
          break;
        }
      }

      //   /**
      //    * GET endpoints
      //    */

      //   if (endpoint === Endpoint.get_all_quizzes) {
      //     const quizzes: QuizType[] = await this.getAllQuizzes();
      //     res.json({ Quizzes: quizzes });
      //   }

      //   if (endpoint === Endpoint.get_quiz) {
      //     const quizID = this.getQuizID(req, res);
      //     const quiz: QuizType[] = await this.db.getQuiz(quizID);
      //     res.json({ Quiz: quiz[0] });
      //   }

      //   if (endpoint === Endpoint.get_quiz_teams) {
      //     const quizID = this.getQuizID(req, res);
      //     const teams: TeamType[] = await this.db.getTeamsByQuizID(quizID);
      //     res.json({ Teams: teams });
      //   }

      //   if (endpoint === Endpoint.get_quiz_rounds) {
      //     const quizID = this.getQuizID(req, res);
      //     const rounds: RoundType[] = await this.db.getRoundsByQuizID(quizID);
      //     res.json({ Rounds: rounds });
      //   }

      //   if (endpoint === Endpoint.get_quiz_round_questions) {
      //     const roundUUID = req.query.roundUUID as string;
      //     if (!roundUUID) {
      //       res.status(404).send("Invalid round UUID: " + req.query.roundUUID);
      //     }
      //     const questions: QuestionType[] = await this.db.getQuestionsByRoundUUID(
      //       roundUUID
      //     );
      //     res.json({ Questions: questions });
      //   }

      //   /**
      //    * CREATE endpoints
      //    */

      //   if (endpoint === Endpoint.create_quiz) {
      //     const quiz: QuizType = req.body.Quiz;
      //     const quizID: number = await this.db.createQuiz(quiz);
      //     res.json({ QuizID: quizID });
      //   }

      //   if (endpoint === Endpoint.create_quiz_teams) {
      //     const quizID: number = req.body.QuizID;
      //     const teams: TeamType[] = req.body.Teams;
      //     const quiz: QuizType[] = await this.db.getQuiz(quizID);
      //     if (quiz.length === 0) {
      //       res.status(400).send("Invalid quiz ID: " + req.body.QuizID);
      //     }
      //     if (teams?.length) {
      //       res.status(200).send("No value for Teams provided");
      //     }
      //     await this.createQuizTeams(quizID, teams);
      //     res.status(201).send("Created teams");
      //   }

      //   if (endpoint === Endpoint.create_quiz_rounds) {
      //     const rounds: RoundType[] = req.body.Rounds;
      //     if (rounds?.length) {
      //       res.status(200).send("No value for Rounds provided");
      //     }
      //     for (const round of rounds) {
      //       await this.db.createRound(round);
      //     }
      //     res.status(201).send("Created rounds");
      //   }

      //   if (endpoint === Endpoint.create_quiz_round_questions) {
      //     const questions: QuestionType[] = req.body.Questions;
      //     if (questions?.length) {
      //       res.status(200).send("No value for Questions provided");
      //     }
      //     const files = req.files as object;
      //     const media: File[] = [];
      //     Object.keys(files).forEach(function (key) {
      //       // media.push(files[key as keyof Request["files"]]);
      //       media.push(files[key as keyof typeof files]);
      //     });

      //     for (const question of questions) {
      //       const file: File | undefined = media.find(
      //         (x: File) => parseInt(x.originalname) === question.SequenceNumber
      //       );
      //       const mediaBase64 = file?.buffer
      //         ? Buffer.from(file.buffer).toString("base64")
      //         : "";

      //       question.MediaBase64 = mediaBase64;
      //       await this.db.createQuestion(question);
      //     }

      //     res.status(201).send("Created questions");
      //   }

      //   /**
      //    * EDIT endpoints
      //    */

      //   if (endpoint === Endpoint.edit_quiz) {
      //     const quiz: QuizType = req.body.Quiz;
      //     await this.db.updateQuiz(quiz);
      //     res.status(204).send("Updated quiz");
      //   }

      //   if (endpoint === Endpoint.edit_quiz_teams) {
      //     const teams: TeamType[] = req.body.Teams;
      //     if (teams?.length) {
      //       res.status(200).send("No value for Teams provided");
      //     }
      //     for (const team of teams) {
      //       await this.db.updateTeam(team);
      //     }
      //     res.status(204).send("Updated teams");
      //   }

      //   if (endpoint === Endpoint.edit_quiz_rounds) {
      //     const rounds: RoundType[] = req.body.Rounds;
      //     if (rounds?.length) {
      //       res.status(200).send("No value for Rounds provided");
      //     }
      //     for (const round of rounds) {
      //       await this.db.updateRound(round);
      //     }
      //     res.status(204).send("Updated rounds");
      //   }

      //   if (endpoint === Endpoint.edit_quiz_round_questions) {
      //     const questions: QuestionType[] = req.body.Questions;
      //     if (questions?.length) {
      //       res.status(200).send("No value for Questions provided");
      //     }
      //     const files = req.files as object;
      //     const media: File[] = [];
      //     Object.keys(files).forEach(function (key) {
      //       // media.push(files[key as keyof Request["files"]]);
      //       media.push(files[key as keyof typeof files]);
      //     });

      //     for (const question of questions) {
      //       const file: File | undefined = media.find(
      //         (x: File) => parseInt(x.originalname) === question.SequenceNumber
      //       );
      //       const mediaBase64 = file?.buffer
      //         ? Buffer.from(file.buffer).toString("base64")
      //         : "";

      //       question.MediaBase64 = mediaBase64;
      //       await this.db.updateQuestion(question);
      //     }

      //     res.status(204).send("Updated questions");
      //   }

      //   /**
      //    * Quiz status endpoint
      //    */

      //   if (endpoint === Endpoint.set_quiz_status) {
      //     const quizID: number = req.body.QuizID;
      //     const status: QuizLifecycleStatusCode =
      //       req.body.QuizLifecycleStatusCode;
      //     const quiz: QuizType = { ID: quizID, LifecycleStatusCode: status };
      //     await this.db.updateQuiz(quiz);
      //     res.status(204).send("Updated quiz status");
      //   }

      //   /**
      //    * Quiz progress endpoint
      //    */

      //   if (endpoint === Endpoint.record_quiz_progress) {
      //     const quizID: number = req.body.QuizID;
      //     const currentRoundSeq: number = req.body.CurrentRoundSeq;
      //     const currentQuestionSeq: number = req.body.CurrentQuestionSeq;
      //     const quiz: QuizType = {
      //       ID: quizID,
      //       CurrentRoundSeq: currentRoundSeq,
      //       CurrentQuestionSeq: currentQuestionSeq,
      //     };
      //     await this.db.updateQuiz(quiz);
      //     res.status(204).send("Updated quiz progress");
      //   }

      //   if (endpoint === Endpoint.record_team_response) {
      //     const questionUUID: string = req.body.QuestionUUID;
      //     const actualTeamUUID: string = req.body.ActualTeamUUID;
      //     const actualMarkGiven: number = req.body.ActualMarkGiven;
      //     const answerGiven: string = req.body.AnswerGiven;
      //     const question: QuestionType = {
      //       UUID: questionUUID,
      //       ActualTeamUUID: actualTeamUUID,
      //       ActualMarkGiven: actualMarkGiven,
      //       AnswerGiven: answerGiven,
      //     };
      //     await this.db.updateQuestion(question);
      //     res.status(204).send("Recorded question response");
      //   }
    } catch (error) {
      logger.error(
        "RequestHandler->handleRequest: " + endpoint + " Error: " + error
      );
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

  private async fillMediaType(questions: QuestionType[]): Promise<void> {
    for (const question of questions) {
      const mimeType = await fileTypeFromBuffer(
        Buffer.from(question.MediaBase64!, "base64")
      );
      const mediaType = mimeType?.mime.split("/")[0];
      if (
        mimeType &&
        (mediaType === MediaType.Image ||
          mediaType === MediaType.Video ||
          mediaType === MediaType.Audio)
      ) {
        question.MimeType_Transient = mimeType.mime;
      } else if (question.MediaBase64 && question.MediaBase64.length > 0) {
        throw new Error(
          "Invalid mime type of media: " + JSON.stringify(mimeType)
        );
      }
    }
  }
}
