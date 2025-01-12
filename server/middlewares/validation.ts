import Joi from "joi";
import { NextFunction, Response, Request } from "express";
import prepareResponse from "../utils/response";

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json(prepareResponse(400, error.details[0].message));
            return;
        }
        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params);
        if (error) {
            res.status(400).json(prepareResponse(400, error.details[0].message));
            return;
        }
        next();
    };
};