import { ffprobe } from "fluent-ffmpeg";
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

async function validateVideoDuration(filepath:string,minDuration=5,maxDuration=25): Promise<boolean|string> {
    return new Promise((resolve,reject)=>{
        ffprobe(filepath,(err,metadata)=>{
            if(err){
                reject("Error retrieving video metadata");
                return;
            }
            const duration  = metadata.format.duration ?? 0;
            if(duration  < minDuration){
                reject("Video is too short Or could not retrieve duration from metadata");
                return;
            }
            if(duration > maxDuration){
                reject ("Video too long!");
                return;
            }
            resolve(true);
        })
    })
}

function validateSize(filesize:number) {
    if(filesize > MAX_SIZE){
        return false;
    }
    return true;
}

export {validateVideoDuration,validateSize};