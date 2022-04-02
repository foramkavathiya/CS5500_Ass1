/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
 import Tuit from "../models/Tuit";
 import TuitModel from "../mongoose/TuitModel";
 import TuitDaoI from "../interfaces/TuitDao";
 
 
 /**
  * @class TuitDao Implements Data Access Object managing data storage
  * of Tuits
  * @property {TuitDao} tuitDao Private single instance of TuitDao
  */

 export default class TuitDao implements TuitDaoI{
     private static tuitDao: TuitDao | null = null;
     public static getInstance = (): TuitDao => {
         if(TuitDao.tuitDao === null) {
             TuitDao.tuitDao = new TuitDao();
         }
         return TuitDao.tuitDao;
     }
     private constructor() {}

    /**
      * Retrieves all tuits from the database.
      */

     findAllTuits = async (): Promise<Tuit[]> =>
         TuitModel.find();

    /**
      * Retrieves all tuits from the database for a particular user.
      * @param uid Represents id of the user.
      */
    
     findTuitsByUser = async (uid: string): Promise<Tuit[]> =>
         TuitModel.find({postedBy: uid});

    /**
      * Retrieves all tuits from the database for a particular id.
      * @param uid Represents id of the user.
      */

     findTuitById = async (uid: string): Promise<any> =>
         TuitModel.findById(uid)
             .populate("postedBy")
             .exec();

    /**
      * Creates a new tuit instance
      * @param uid Represents id of the user.
      * @param tuit Represents the tuit.
      */
    
     createTuit= async (uid: string, tuit: Tuit): Promise<Tuit> =>
         TuitModel.create({...tuit, postedBy: uid});

    /**
      * Modifies an existing tuit instance
      * @param uid Represents id of the user.
      * @param tuit Represents the tuit.
      */
    
     updateTuit = async (uid: string, tuit: Tuit): Promise<any> =>
         TuitModel.updateOne(
             {_id: uid},
             {$set: tuit});

    /**
      * Removes a tuit instance from the database
      * @param uid Represents id of the user.
      */

     deleteTuit = async (uid: string): Promise<any> =>
         TuitModel.deleteOne({_id: uid});

    /**
     * Removes tuit from the database. Used for testing
     * @param {string} uid Primary key of the dummy user whose tuit to be removed
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuitByUserId = async (uid: string): Promise<any> =>
          TuitModel.deleteOne({postedBy: uid});

    /**
     * Update likes
     * @param {string} tid Primary key of the tuit
     * @param {stats} newStats Stats of the tuit
     */

    updateLikes = async (tid: string, newStats: any): Promise<any> =>
          TuitModel.updateOne(
             {_id: tid},
             {$set: {stats: newStats}}
        );
 }