import Tuit from "../models/Tuit";
import TuitModel from "../mongoose/TuitModel";
import TuitDaoI from "../interfaces/TuitDao";


export default class TuitDao implements TuitDaoI{
    private static tuitDao: TuitDao | null = null;
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() {}
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find();
    findTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid});
    findTuitById = async (uid: string): Promise<any> =>
        TuitModel.findById(uid)
            .populate("postedBy")
            .exec();
    createTuit = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid});
    updateTuit = async (uid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: uid},
            {$set: tuit});
    deleteTuit = async (uid: string): Promise<any> =>
        TuitModel.deleteOne({_id: uid});
}


// export default class TuitDao implements TuitDaoI {

//     private static tuitDao: TuitDao | null = null;
//     public static getInstance = (): TuitDao => {
//         if(TuitDao.tuitDao === null) {
//             TuitDao.tuitDao = new TuitDao();
//         }
//         return TuitDao.tuitDao;
//     }
    
//     async findAllTuits(): Promise<Tuit[]> {
//         return await TuitModel.find();
//     }
//     async findTuitsByUser(uid: string): Promise<any> {
//         return await TuitModel.find({postedBy:uid});
//     }
//     async findTuitById(tid: string): Promise<any> {
//         return await TuitModel.findById(tid);
//     }
//     async createTuit(tuit: Tuit): Promise<Tuit> {
//         return await TuitModel.create({tuit});
//     }
//     async updateTuit(tid: string, tuit: Tuit): Promise<any> {
//         return await TuitModel.updateOne({_id: tid}, {$set: tuit});
//     }
//     async deleteTuit(tid: string):  Promise<any> {
//         return await TuitModel.deleteOne({_id: tid});
//     }
//  }
 