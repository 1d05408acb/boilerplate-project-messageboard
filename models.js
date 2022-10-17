const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date();

// Create a schema for the board
const ReplySchema = new Schema({
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    created_on: { type: Date, default: date },
    bumped_on: { type: Date, default: date },
    reported: { type: Boolean, default: false },
});

const Reply = mongoose.model("Reply", ReplySchema);

// Create a schema for the board
const ThreadSchema = new Schema({
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    created_on: { type: Date, default: date },
    bumped_on: { type: Date, default: date },
    replies: { type: [ReplySchema], default: [] },
});

const Thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
    name: { type: String, required: true },
    threads: { type: [ThreadSchema], default: [] },
});

const Board = mongoose.model("Board", BoardSchema);

// Export the models
exports.Board = Board;
exports.Thread = Thread;
exports.Reply = Reply;
