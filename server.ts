/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>bookmarks</li>
 *     <li>follows</li>
 *     <li>messages</li>
 * </ul>
 * 
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
 import express, {Request, Response} from 'express';
 import UserController from "./controllers/UserController";
 import TuitController from "./controllers/TuitController";
 import LikeController from "./controllers/LikeController";
 import BookmarkController from "./controllers/BookmarkController";
 import FollowController from './controllers/FollowController';
 import MessageController from './controllers/MessageController';
 import mongoose from "mongoose";
 
 
 // build the connection string
 const connectionString = `mongodb+srv://Foram44:Kavathiya4444@cluster0.5hopv.mongodb.net/A1?retryWrites=true&w=majority`;
 // connect to the database
 mongoose.connect(connectionString);
 
 const app = express();
 app.use(express.json());
 
 app.get('/', (req: Request, res: Response) =>
     res.send('Hello World!'));
 
 app.get('/add/:a/:b', (req: Request, res: Response) =>
     res.send(req.params.a + req.params.b));
 
 // create RESTful Web service API
 const userController = UserController.getInstance(app);
 const tuitController = TuitController.getInstance(app);
 const likesController = LikeController.getInstance(app);
 const bookmarksController = BookmarkController.getInstance(app);
 const followController = FollowController.getInstance(app);
 const messageController = MessageController.getInstance(app);
 
 /**
  * Start a server listening at port 4000 locally
  * but use environment variable PORT on Heroku if available.
  */
 const PORT = 4000;
 app.listen(process.env.PORT || PORT);
