import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      sender: { type: String, required: true, max: 150 }, // possible ref a users, de momento es string con el id
      content: { type: String, required: true, max: 5000,},
      isReply: { type: Boolean, required: true, default: false },   // quizás puede ser redundante al tener el replyto.
      replyTo: { type: String,}, //string con id, possible ref a users o mas bien chat members
      mediaUrl:{ type: String,},
      mediaType:{type: String,},
      chat:{type: String,}, //string con id, possible ref a chats
   },
   {
      timestamps: true,
      versionKey: false,
   },
);

const MessagesModel = mongoose.model("messages", schema);

export default messagesModel;
