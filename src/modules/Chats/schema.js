import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      members: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
         },
      ],
      admins: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
         },
      ],
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         required: true,
      },
      isGroup: { type: Boolean, required: true, default: false },
      groupInfo: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "groupInfos",
      },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

const ChatsModel = mongoose.model("chats", schema);

export default ChatsModel;
