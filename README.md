#  Video Processing Application
## Overview

This project is a backend video processing service designed to handle user signups, video uploads, and video processing tasks such as trimming, merging, and generating downloadable links. The API provides an interface for interacting with video files. It includes authentication, file uploads, and video editing operations like trimming and merging.
Features

- User Authentication: Sign up new users and authenticate via JWT.
- Video Upload: Upload video files and store them for processing.
- Trim Video: Trim videos by specifying start time and duration.
- Merge Videos: Merge multiple videos into one.
- Generate Video Link: Create downloadable links for videos.
- Get Processed Video: Retrieve the processed video after editing operations.

### Technologies Used
 - Node.js for backend development.
 - Express.js as the web framework.
 - [JWT](https://www.npmjs.com/package/jsonwebtoken) for user authentication.
 - SQLite as the database 
 - [Multer](https://www.npmjs.com/package/multer) for handling file uploads.
 - Postman for API testing and documentation.
 - [BullMQ](https://www.npmjs.com/package/bullmq) for Async task processing
 - [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) for video processing

## Getting Started
### Prerequisites

Before starting, ensure you have the following installed on your machine:

Recommended OS **Ubuntu 22.04 LTS**

- Node.js: Download and install Node.js from [here](https://nodejs.org/en) LTS version v22.13.0
- Make sure that **ffmpeg** and **ffprobe** are installed on your system. On Linux, they are typically pre-installed. You can verify their installation by opening the command prompt and typing ffmpeg and ffprobe. If not installed download from [here](https://www.ffmpeg.org/download.html) and add to your path.
- Also make sure Redis is installed. Download community edition from this page 
https://redis.io/downloads/. Download version 7.4

-  Git version control https://git-scm.com/downloads


## Setup Server
Run the follwing commands on terminal
1. git clone https://github.com/naman-narula/videoverse
2. cd videoverse
3. npm install

## Run the server
Run the follwing command on terminal
-  npm run dev:start


## Test
- npm run test
   
### For checking coverage of tests
- npm run coverage


#### Link to postman collection [Postman collection](./videoverse.postman_collection.json)