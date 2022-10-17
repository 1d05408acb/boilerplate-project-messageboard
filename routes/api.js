'use strict';

const BoardModel = require('../models').Board;
const ThreadModel = require('../models').Thread;
const ReplyModel = require('../models').Reply;

module.exports = function (app) {
  
  app.route('/api/threads/:board').post((req, res) => {
    const {text, delete_password} = req.body;
      let board = req.body.board;
      if (!board) {
        board = req.params.board;
      }
      console.log("post", req.body);
      const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password,
        replies: [],
      });
      console.log("newThread", newThread);
      BoardModel.findOne({name: board}, (err, BoardData) => {
        if (!BoardData) {
          const newBoard = new BoardModel({
            name: board,
            threads: [],
          });
          console.log("newBoard", newBoard);
          newBoard.threads.push(newThread);
          newBoard.save((err, savedBoard) => {
            console.log("newBoardData", data);
            if (err || !data ) {
              console.log(err);
              res.send("There was an error saving the new board");
            } else {
              res.json(newThread);
            } 
          });
        } else {
          BoardData.threads.push(newThread);
          BoardData.save((err, data) => {
            if ( err || !data ) {
              res.send("There was an error saving the new thread");
            } else {
              res.json(newThread);
            }
          });
        }
      });
    }).get((req, res) => {
      const board = req.params.board;
      BoardModel.findOne({name: board}, (err, data) => {
        if (!data) {
          console.log("No board found");
          res.json({error: "No board found"});
        } else {
          console.log("data", data);
          const threads = data.threads.map((thread) => {
            const {
              _id,
              text,
              created_on,
              bumped_on,
              reported,
              delete_password,
              replies,
            } = thread;
            return {
              _id,
              text,
              created_on,
              bumped_on,
              reported,
              delete_password,
              replies,
              replycount: thread.replies.length,
            };
          });
          res.json(threads);
        }
      });
    }).put((req, res) => {
      console.log("put", req.body);
      const { report_id } = req.body;
      const board = req.params.board;
      BoardModel.findOne({name: board}, (err, boardData) => {
        if (!boardData) {
          res.json({error: "No board found"});
          } else {
            const date = new Date();
            let reportedThread = boardData.threads.id(report_id);
            reportedThread.reported = true;
            reportedThread.bumped_on = date;
            boardData.save((err, data) => {
              res.send("Success");
              });
            }
          });
        }).delete((req, res) => {
          console.log("delete", req.body);
          const { thread_id, delete_password } = req.body;
          const board = req.params.board;
          BoardModel.findOne({name: board}, (err, boardData) => {
            if (!boardData) {
              res.json({error: "No board found"});
            } else {
              let threadToDelete = boardData.threads.id(thread_id);
              if (threadToDelete.delete_password === delete_password) {
                threadToDelete.remove();
              } else {
                res.send("Incorrect password");
                return;
              }
              boardData.save((err, updatedData) => {
                res.send("Success");
              });
            }
          });
        });
  app.route('/api/replies/:board').post((req, res) => {
    console.log("thread", req.body);
    const { text, delete_password, thread_id } = req.body;
    const board = req.params.board;
    const newReply = new ReplyModel({
      text: text,
      delete_password: delete_password,
    });
    BoardModel.findOne({name: board}, (err, boardData) => {
      if (!boardData) {
        res.json({error: "No board found"});
      } else {
        const date = new Date();
        let threadToUpdate = boardData.threads.id(thread_id);
        threadToUpdate.bumped_on = date;
        threadToUpdate.replies.push(newReply);
        boardData.save((err, updatedData) => {
          res.json(updatedData);
        });
      }
    });
  }).get((req, res) => {
    const board = req.params.board;
    BoardModel.findOne({name: board}, (err, data) => {
      if (!data) {
        console.log("No board found");
        res.json({error: "No board found"});
      } else {
        console.log("data", data);
        const threads = data.threads.id(req.query.thread_id);
        res.json(thread);
      }
    });
  }).put((req, res) => {
    const { thread_id, reply_id } = req.body;
    const board = req.params.board;
    BoardModel.findOne({name: board}, (err, data) => {
      if (!data) {
        console.log("No board found");
        res.json({error: "No board found"});
      } else {
        console.log("data", data);
        const thread = data.threads.id(thread_id);
        const reply = thread.replies.id(reply_id);
        reply.reported = true;
        reply.bumped_on = new Date();
        data.save((err, updatedData) => {
          if (!err) {
            res.send("Success");
          }
        });
      }
    });
  }).delete((req, res) => {
    const { thread_id, reply_id, delete_password } = req.body;
    const board = req.params.board;
    console.log("delete", req.body);
    BoardModel.findOne({name: board}, (err, data) => {
      if (!data) {
        console.log("No board found");
        res.json({error: "No board found"});
      } else {
        console.log("data", data);
        const thread = data.threads.id(thread_id);
        const reply = thread.replies.id(reply_id);
        if (reply.delete_password === delete_password) {
          reply.remove();
        } else {
          res.send("Incorrect password");
          return;
        }
        data.save((err, updatedData) => {
          if (!err) {
            res.send("Success");
          }
        });
      }
    });
  });
};
