/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */

import LikeDaoI from "../interfaces/LikeDao";
import LikeModel from "../mongoose/LikeModel";
import Like from "../models/Like";

/**
  * @class LikeDao Implements Data Access Object managing data storage
  * of Likes
  * @property {LikeDao} likeDao Private single instance of LikeDao
  */

export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() {}

    /**
      * Retrieves all users that liked a tuit from the database
      * @param tid Represents id of the tuit
      */

    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
      * Retrieves all tuits liked by a user from the database
      * @param uid Represents id of the user
      */

     findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
     LikeModel
         .find({likedBy: uid})
         .populate({
             path: "tuit",         
             populate: {
                 path: "postedBy" 
             }
         })
         .exec();

    /**
      * Create a like instance
      * @param uid Represents id of the user
      * @param tid Represents id of the tuit
      */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
      * Removes a like instance
      * @param uid Represents id of the user
      * @param tid Represents id of the tuit
      */

    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});

    /**
      * If a user has liked a particular tuit
      * @param uid Represents id of the user
      * @param tid Represents id of the tuit
      */

    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid});

    /**
      * Counts how many users liked a particular tuit.
      * @param tid Represents id of the tuit
      */

    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});
}