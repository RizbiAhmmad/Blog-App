import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user=req.user
    req.body.authorId=user?.id
   
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment creation failed",
      details: error,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const {commentId}=req.params
   
    const result = await commentService.getCommentById(commentId as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: error,
    });
  }
};
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const {authorId}=req.params
   
    const result = await commentService.getCommentByAuthor(authorId as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment fetched failed",
      details: error,
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user=req.user;
    const {commentId}=req.params
   
    const result = await commentService.deleteComment(commentId as string ,user?.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment delete failed",
      details: error,
    });
  }
};
const updatecomment = async (req: Request, res: Response) => {
  try {
    const user=req.user;
    const {commentId}=req.params
   
    const result = await commentService.updatecomment(commentId as string, req.body, user?.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment update failed",
      details: error,
    });
  }
};

export const commentController={
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updatecomment
}
