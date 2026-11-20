import { Request, Response, NextFunction } from 'express';
import * as documentService from './document.service';

export async function presignUploadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await documentService.requestPresignedUpload(
      { userId: req.user!.userId, role: req.user!.role },
      req.body
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function registerDocumentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await documentService.registerDocument(
      { userId: req.user!.userId, role: req.user!.role },
      req.body
    );
    res.status(201).json({
      success: true,
      message: 'Document registered successfully',
      data: doc,
    });
  } catch (err) {
    next(err);
  }
}

export async function listDocumentsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, companyId } = req.query as { category?: string; companyId?: string };

    if (category === 'COMPANY' || companyId) {
      if (!companyId) {
        res.status(400).json({ success: false, error: 'companyId query parameter is required for company category' });
        return;
      }
      const docs = await documentService.listCompanyDocuments(req.user!.userId, companyId, req.user!.role);
      res.status(200).json({ success: true, data: docs });
      return;
    }

    const docs = await documentService.listUserDocuments(req.user!.userId);
    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
}

export async function downloadDocumentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await documentService.getDocumentDownloadUrl(
      { userId: req.user!.userId, role: req.user!.role },
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
