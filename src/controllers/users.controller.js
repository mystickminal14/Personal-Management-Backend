import { asyncHandler } from './../utils/asyncHandler.js';
const store=asyncHandler(async(req,res)=>{
    res.status(200).send({msg:"The greater goods!"})
})
export {store}