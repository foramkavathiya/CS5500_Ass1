 /**
 * @file Implements mongoose schema for dislikes
 */
  import mongoose, {Schema} from "mongoose";
  import Dislike from "../models/Dislike";
  
  /**
   * @typedef Dislike Represents dislikes relationship between a user and a tuit,
   * as in a user likes a tuit
   * @property {Tuit} tuit Tuit being liked
   * @property {User} dislikedBy User liking the tuit
   */
  
  const DislikeSchema = new mongoose.Schema<Dislike>({
      tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
      dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
  }, {collection: "dislikes"});
  export default DislikeSchema;