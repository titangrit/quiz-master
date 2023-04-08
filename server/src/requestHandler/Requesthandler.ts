import { Request, Response } from 'express';
import { DbHandlerMySql } from "../dbHandlerMySql";
import { CreateParam, UpdateParam } from "../common";

export class RequestHandler {

    handleGET = async (req: Request, res: Response): Promise<void> => {
        const db = await DbHandlerMySql.getInstance();
        let param: any;
        db.createQuizInstance(param);
    }

    handlePOST = async (req: Request, res: Response): Promise<void> => {
        const db = await DbHandlerMySql.getInstance();
        switch (req.params[0]) {
            case 'basic_info':
                let param: CreateParam.QuizInstance = {
                    QuizEventName: req.body.QuizEventName,
                    NumberOfRounds: req.body.NumberOfRounds,
                    NumberOfTeams: req.body.NumberOfTeams
                };

                const quizID = await db.createQuizInstance(param);
                res.json({ quizID: quizID });

                break;

            case 'team_info':
                break;

            case 'round_info':
                break;

            case 'question_info':
                break;

            default:
        }
    }
}
