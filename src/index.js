import dotenv from 'dotenv';
import connectDb from './db/connection.js';
dotenv.config({
    path:'./env'
})
connectDb()