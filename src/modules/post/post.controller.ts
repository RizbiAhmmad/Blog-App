import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    console.log(req.user);
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;
    // console.log({isFeatured});

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    // console.log({postId});
    if (!postId) {
      throw new Error("Post Id is required");
    }

    const result = await postService.getPostById(postId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Get Post by ID is failed",
      details: error,
    });
  }
};
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!!");
    }

    const result = await postService.getMyPosts(user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Get Post fetched failed",
      details: error,
    });
  }
};
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!!");
    }

    const { postId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Post update failed";

    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!!");
    }

    const { postId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin
    );
    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Post delete failed";

    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};
const getStats = async (req: Request, res: Response) => {
  try {
   
    const result = await postService.getStats(
     
    );
    res.status(201).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Stats fetched failed";

    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats
};
