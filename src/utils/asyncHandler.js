export const asyncHandler=(fn)=>async(req,res,next)=>{
    try{
       return await fn(req,res,next)
    }
    catch(err){
        console.error(err);
        const statusCode = (err.code >= 100 && err.code < 600) ? err.code : 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    }
}
