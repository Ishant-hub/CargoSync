import { Request, Response, NextFunction } from 'express';
import * as companyService from './company.service';

export async function createCompanyHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await companyService.createCompany(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCompanyTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const team = await companyService.getCompanyTeam(req.params.id);
    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCompanyVerificationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await companyService.updateCompanyVerification(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: 'Company verification status updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}
