const express = require("express");
const router = express.Router();
const UserModel = require('../models/UsersDB');
const PostsModel = require('../models/PostsDB');
const CommentsModel = require('../models/CommentsDB');