import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user has the required role
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is authenticated and has the required role
    if (!req.isAuthenticated() || !req.user || !roles.includes(req.user.role)) {
      if(req.user != undefined){
        return res.status(403).json({ message: `Forbidden. Insufficient role: ${req.user.role}` });
      }
        return res.status(403).json({ message: 'Forbidden. Insufficient role: Undefined' });
    }
    next();
  };
};
