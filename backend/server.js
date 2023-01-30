import express from "express";

import userRouter from "./routes/userRoutes.js";
import questRouter from "./routes/questRoutes.js";

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use('/api/users',userRouter);
app.use('/api/quest',questRouter);



app.use((err,req,res,next)=>{
    req.status(500).send({message:err.message});
});

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`serve at http://localhost:${port}`);
});