import Like from "../models/Like";
import Dislike from "../models/Dislike";

/**
 * @file Declares API for Dislikes related data access object methods
 */

export default interface DislikeDao {
    findAllUsersThatDislikedTuit (tid: string): Promise<Dislike[]>;
    findAllTuitsDislikedByUser (uid: string): Promise<Dislike[]>;
    userDislikesTuit (tid: string, uid: string): Promise<any>;
    userRemoveDislikesTuit (tid: string, uid: string): Promise<Dislike>;
};