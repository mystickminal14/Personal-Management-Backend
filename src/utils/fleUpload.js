import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET 
})

const uploadCloud=async(localpath)=>{
    try{
        if(!localpath){
            return null
        }
       const response =await cloudinary.uploader.upload(localpath,{
            resource_type:"auto"
        })
        //file has been uploaded
        console.log("file is uploaded on cloudinary!!",response.url)
        return response
       
    }catch(error){
        fs.unlinkSync(localpath)
        return null

    }
}
export {uploadCloud}