import { prisma } from "db/client";
import type { Request , Response } from "express";

export const getWebsite = async (req: Request, res: Response) => {
    //http:localhost:3001/api/v1/website/status/:websiteId
    
 const { websiteId } = req.params;

 if (typeof websiteId !== "string") {
   return res.status(400).json({ message: "Invalid website id" });
 }

 const website = await prisma.website.findFirst({
   where: {
     userId: req.user!.id,
     id: websiteId,
   },
   include: {
     ticks: {
       orderBy: [
         {
           createdAt: "desc",
         },
       ],
       take: 1,
     },
   },
 });

 if (!website) {
   res.status(409).json({
     message: "Not found",
   });
   return;
 }
 res.json({
   url: website.url,
   id: website.id,
   userId: website.userId,
 });
};



export const postWebsite = async (req: Request, res: Response) => {
    if (!req.body.url) {
        res.status(404).json({
            message:"url field is empty"
        })
    }
    const website = await prisma.website.create({
        data: {
            url: req.body.url,
            userId:req.user!.id
        }
        
    })
    res.json({
        message: `website created at : ${website.createdAt}`,
        id : website.id
    })
   
};