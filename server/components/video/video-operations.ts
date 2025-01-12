import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs'
import path from 'path';
import { VideoModel } from '../../@types/video';

function trimVideo(inputPath:string, outputPath:string, startTime:string, duration:string) {
  return new Promise((resolve, reject) => {
    try{
    ffmpeg(inputPath)
      .setStartTime(startTime) // Example: '00:00:05'
      .duration(duration)      // Example: 10 (seconds)
      .output(outputPath)
      .on('end', () => resolve(`Trimmed video saved to ${outputPath}`))
      .on('error', (err) => reject(`Error trimming video: ${err.message}`))
      .run();
    }
    catch(err){
      console.error(err);
    }
  });
}

function mergeVideos(videoPaths:Array<string>, outputPath:string) {
  return new Promise((resolve, reject) => {
    try {
    const fileListPath = path.join(process.cwd(),'filelist.txt');
    console.log(videoPaths,outputPath,fileListPath);
    const fileListContent = videoPaths.map((file) => `file '${file}'`).join('\n');
    fs.writeFileSync(fileListPath, fileListContent);

    ffmpeg()
      .input(fileListPath)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .output(outputPath)
      .on('end', () => {
        fs.unlinkSync(fileListPath); // Cleanup
        resolve(`Merged video saved to ${outputPath}`);
      })
      .on('error', (err) => {
        fs.unlinkSync(fileListPath); // Cleanup on error
        reject(`Error merging videos: ${err.message}`);
      })
      .run();
    }
    catch(err){
      console.log(err);
    }
  });

}


export { trimVideo,mergeVideos };