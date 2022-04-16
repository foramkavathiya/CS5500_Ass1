/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
 import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkController";
import TuitDao from "../daos/TuitDao";

 
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();

    private static bookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
           BookmarkController.bookmarkController = new BookmarkController();
            app.get("/api/tuits/:tid/bookmarks", BookmarkController.bookmarkController.findAllUsersThatBookmarkedTuit);
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsThatBookmarkedByAUser);
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/api/users/:uid/unbookmarks/:tid", BookmarkController.bookmarkController.userUnbookmarksTuit);
            app.put("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userTogglesTuitBookmarks);

        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all users that bookmarked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then(bookmarks => res.json(bookmarks ));

    /**
     * Retrieves all tuit that bookmarked a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */


   findAllTuitsThatBookmarkedByAUser = (req: Request, res: Response) => {
           const uid = req.params.uid;
           // @ts-ignore
           const profile = req.session['profile'];
           const userId = uid === "me" && profile ?
               profile._id : uid;

           BookmarkController.bookmarkDao.findAllTuitsThatBookmarkedByAUser(userId)
               .then(bookmarks => {
                   const bookmarksNonNullTuits = bookmarks.filter(bookmark => bookmark.bookmarkedTuit);
                   const tuitsFromBookmarks = bookmarksNonNullTuits.map(bookmark => bookmark.bookmarkedTuit);
                   res.json(tuitsFromBookmarks);
               });
       }

    /**
     * Create a bookmark instance
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
     userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Removes a bookmark instance
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuit being unbookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
     userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

     userTogglesTuitBookmarks = async (req: Request, res: Response) => {
             const bookmarkDao = BookmarkController.bookmarkDao;
             const tuitDao = BookmarkController.tuitDao;
             const uid = req.params.uid;
             const tid = req.params.tid;
             // @ts-ignore
             const profile = req.session['profile'];
             const userId = uid === "me" && profile ?
                 profile._id : uid;
             try {
                 const userAlreadyBookmarkedTuit = await BookmarkController.bookmarkDao.findUserBookmarksTuit(userId, tid);
                 const howManyBookmarkedTuit = await BookmarkController.bookmarkDao.countHowManyBookmarkedTuit(tid);
                 let tuit = await tuitDao.findTuitById(tid);
                 if (userAlreadyBookmarkedTuit) {
                     await BookmarkController.bookmarkDao.userUnbookmarksTuit(userId, tid);
                     tuit.stats.bookmarks = 0 ;

                 } else {
                     await BookmarkController.bookmarkDao.userBookmarksTuit(userId, tid);
                     tuit.stats.bookmarks =  1;
                 }
                 await BookmarkController.tuitDao.updateBookmarks(tid, tuit.stats);
                 res.sendStatus(200);
             } catch (e) {
                 res.sendStatus(404);
             }
         }
};
