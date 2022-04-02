import {Request, Response} from "express";

/**
 * @file Declares interface for Dislike Controller.
 */

export default interface DislikeController {
    findAllTuitsDislikedByUser(req: Request, res: Response): void;
    userTogglesTuitDislikes (req: Request, res: Response): void;
};