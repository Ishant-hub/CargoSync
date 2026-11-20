import { Request, Response, NextFunction } from 'express';
import * as invitationService from './invitation.service';

export async function createInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const invite = await invitationService.createInvitation(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Invitation code generated',
      data: invite,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const details = await invitationService.verifyInvitation(req.params.code);
    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (err) {
    next(err);
  }
}

export async function acceptInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await invitationService.acceptInvitation(req.user!.userId, req.body.code);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
