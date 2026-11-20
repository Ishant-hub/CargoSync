import { Request, Response, NextFunction } from 'express';
import * as verificationService from './verification.service';

export async function submitUserKYCHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.submitUserKYC(req.user!.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function submitCompanyVerificationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.submitCompanyVerification(req.user!.userId, req.params.companyId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getUserStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.getUserVerificationStatus(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.getCompanyVerificationStatus(
      req.user!.userId,
      req.params.companyId,
      req.user!.role
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function listPendingReviewsHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const queue = await verificationService.listPendingReviews();
    res.status(200).json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
}

export async function startReviewHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { entityType, entityId } = req.body as { entityType: 'INDIVIDUAL' | 'COMPANY'; entityId: string };
    const result = await verificationService.startReview(req.user!.userId, entityType, entityId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function reviewUserDecisionHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.reviewUserDecision(
      req.user!.userId,
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function reviewCompanyDecisionHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.reviewCompanyDecision(
      req.user!.userId,
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resubmitUserKYCHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.resubmitUserKYC(req.user!.userId, req.body.notes);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resubmitCompanyVerificationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.resubmitCompanyVerification(
      req.user!.userId,
      req.params.companyId,
      req.body.notes
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
