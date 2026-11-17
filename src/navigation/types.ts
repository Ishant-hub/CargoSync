import { UserRole } from '../types';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  AccountSelection: undefined;
  ChooseRole: { accountType: 'individual' | 'company' };
  PersonalDetails: { role: UserRole; accountType: 'individual' | 'company' };
  IdentityVerification: { role: string; name: string };
  RegistrationComplete: { role: string; accountId?: string; name?: string };
  VerificationCorrection: { issues?: string[] } | undefined;
  CompanyRegistration: undefined;
  CompanyDocuments: { companyName: string; gstin: string };
  CompanyReviewStatus: { companyName?: string } | undefined;
  CompanyVerified: { companyName?: string } | undefined;
  JoinCompany: undefined;
  CompanyConnected: { companyName: string; position?: string };
};

export type ShipperTabParamList = {
  ShipperHome: undefined;
  ShipperShipments: undefined;
  ShipperMap: undefined;
  ShipperOptimize: undefined;
  ShipperProfile: undefined;
};

export type ShipperStackParamList = {
  ShipperTabs: undefined;
  CreateShipment: undefined;
  FindTrucks: { shipmentId?: string; pickup?: string; destination?: string; weight?: number } | undefined;
  ShipmentDetails: { shipmentId: string };
  Notifications: undefined;
};

export type DriverTabParamList = {
  DriverHome: undefined;
  DriverRoute: undefined;
  DriverShipments: undefined;
  DriverMap: undefined;
  DriverProfile: undefined;
};

export type DriverStackParamList = {
  DriverTabs: undefined;
  JobDetailsAccept: { jobId: string };
  DriverConfirmPickup: { jobId: string; tripId?: string };
  DriverNavigation: { tripId: string; destination?: string };
  DriverCompleteDelivery: { tripId: string; jobId: string };
  ReportProblem: { tripId?: string; jobId?: string } | undefined;
  Notifications: undefined;
};

export type FleetTabParamList = {
  FleetOverview: undefined;
  FleetTrucks: undefined;
  FleetOptimize: undefined;
  FleetMap: undefined;
  FleetProfile: undefined;
};

export type FleetStackParamList = {
  FleetTabs: undefined;
  TruckDetails: { truckId: string };
  CombineShipments: { opportunityId?: string } | undefined;
  DisruptionRecovery: { disruptionId?: string } | undefined;
  Notifications: undefined;
};

export type CompanyAdminTabParamList = {
  AdminOverview: undefined;
  TeamManagement: undefined;
  AdminFleet: undefined;
  AdminSettings: undefined;
};

export type CompanyAdminStackParamList = {
  AdminTabs: undefined;
  TeamManagement: undefined;
  EmployeeDetails: { employeeId: string };
  Notifications: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  ShipperApp: undefined;
  DriverApp: undefined;
  FleetApp: undefined;
  CompanyAdminApp: undefined;
};
