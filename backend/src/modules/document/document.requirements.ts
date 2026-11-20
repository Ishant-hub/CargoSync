import { DocumentType } from '@prisma/client';
import { AppError } from '../../middlewares/error.middleware';

export interface RequirementSpec {
  required: DocumentType[];
  anyOf?: DocumentType[][];
  disallowed?: DocumentType[];
  description: string;
}

export const ROLE_DOCUMENT_REQUIREMENTS: Record<string, RequirementSpec> = {
  SHIPPER: {
    required: [],
    anyOf: [[DocumentType.PAN, DocumentType.AADHAAR]],
    disallowed: [DocumentType.DRIVING_LICENCE],
    description: 'Shippers require PAN or Aadhaar for identity verification. Driving licence is not permitted.',
  },
  DRIVER: {
    required: [DocumentType.DRIVING_LICENCE],
    anyOf: [[DocumentType.AADHAAR, DocumentType.PAN]],
    description: 'Drivers require a valid Driving Licence and at least one secondary identity proof (Aadhaar or PAN).',
  },
  FLEET_MANAGER: {
    required: [],
    anyOf: [[DocumentType.PAN, DocumentType.AADHAAR]],
    description: 'Fleet Managers require PAN or Aadhaar for identity verification.',
  },
  COMPANY_ADMIN: {
    required: [],
    anyOf: [[DocumentType.PAN, DocumentType.AADHAAR]],
    description: 'Company Admins require personal KYC (PAN or Aadhaar) separate from company statutory documents.',
  },
};

export const COMPANY_DOCUMENT_REQUIREMENTS: RequirementSpec = {
  required: [DocumentType.GST_CERTIFICATE],
  anyOf: [[DocumentType.PAN, DocumentType.INCORPORATION, DocumentType.BANK_STATEMENT]],
  description: 'Companies require GST Certificate and at least one statutory business document (Company PAN, Incorporation Certificate, or Bank Statement).',
};

export function validateDocumentSubmissionForRole(role: string, submittedTypes: DocumentType[]): {
  isValid: boolean;
  missingRequirements: string[];
} {
  const spec = ROLE_DOCUMENT_REQUIREMENTS[role];
  if (!spec) {
    return { isValid: true, missingRequirements: [] };
  }

  // Check disallowed
  if (spec.disallowed) {
    for (const disallowedType of spec.disallowed) {
      if (submittedTypes.includes(disallowedType)) {
        throw new AppError(
          `Document type ${disallowedType} is not permitted for role ${role}. ${spec.description}`,
          400
        );
      }
    }
  }

  const missing: string[] = [];

  // Check mandatory
  for (const req of spec.required) {
    if (!submittedTypes.includes(req)) {
      missing.push(`Missing mandatory document: ${req}`);
    }
  }

  // Check anyOf groups
  if (spec.anyOf) {
    for (const group of spec.anyOf) {
      const hasAny = group.some((type) => submittedTypes.includes(type));
      if (!hasAny) {
        missing.push(`Must provide at least one of: ${group.join(' or ')}`);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missingRequirements: missing,
  };
}

export function validateCompanyDocumentSubmission(submittedTypes: DocumentType[]): {
  isValid: boolean;
  missingRequirements: string[];
} {
  const spec = COMPANY_DOCUMENT_REQUIREMENTS;
  const missing: string[] = [];

  for (const req of spec.required) {
    if (!submittedTypes.includes(req)) {
      missing.push(`Missing mandatory company document: ${req}`);
    }
  }

  if (spec.anyOf) {
    for (const group of spec.anyOf) {
      const hasAny = group.some((type) => submittedTypes.includes(type));
      if (!hasAny) {
        missing.push(`Must provide at least one of: ${group.join(' or ')}`);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missingRequirements: missing,
  };
}
