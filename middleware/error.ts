import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";


export const ErrorMiddleware = (err:any, reg:Request, res: Response, next: NextFunction ) =>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal serve error'

    // Wrong mogodb id error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // duplicat key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValues)} entered`
        err = new ErrorHandler(message, 400)
    }

    // worng jwt error
    if (err.code === 'JsonWebToken') {
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHandler(message, 400)
    }

    // jwt expired error
    if (err.code === 'TokenExpiredError') {
        const message = `Json Web Token is expried, try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success : false,
        message: err.message,
    })

}