//Citation: https://mongoosejs.com/docs/
import mongoose, { ConnectOptions } from "mongoose";


mongoose.connect(
  "mongodb+srv://FSE_SB1:vh0rRGFm3u4E3h3V@esn.pwj9fb8.mongodb.net/?retryWrites=true&w=majority", 
  {useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const User = new mongoose.Schema({
  username: String,
  password: String,
});

const userData = mongoose.model("userData", User);

export default userData;
