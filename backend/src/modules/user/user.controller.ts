import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export async function getMeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getCurrentUser(req.user!.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateVerificationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await userService.updateVerificationStatus(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: 'User verification status updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}
