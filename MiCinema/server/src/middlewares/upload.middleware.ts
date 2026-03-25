import { Request, Response, NextFunction } from 'express';
import { upload } from '../utils/upload.util.js';
import { responseError } from '../utils/response.js';

export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        return res.status(400).json(responseError(err.message));
      }
      next();
    });
  };
};

export const uploadArray = (fieldName: string, maxCount: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        return res.status(400).json(responseError(err.message));
      }
      next();
    });
  };
};
