import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, AccountType, VerificationStatus, Company, CompanyEmployee, EmployeeRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  company: Company | null;
  employees: CompanyEmployee[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, role?: UserRole) => Promise<void>;
  signUp: (name: string, email: string, phone: string, role: UserRole) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  onboardIndividual: (params: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    cityHub?: string;
  }) => Promise<User>;
  registerCompany: (params: {
    legalName: string;
    businessType: string;
    gstin: string;
    registeredAddress: string;
    fleetSize?: number;
  }) => Promise<Company>;
  joinCompanyByCode: (code: string) => Promise<{ success: boolean; companyName?: string }>;
  inviteEmployee: (params: { name: string; email: string; phone: string; role: EmployeeRole }) => Promise<CompanyEmployee>;
  updateEmployeeRole: (employeeId: string, role: EmployeeRole) => Promise<void>;
  removeEmployee: (employeeId: string) => Promise<void>;
  updateVerificationStatus: (status: VerificationStatus) => Promise<void>;
  logout: () => Promise<void>;
}

const AUTH_USER_KEY = '@cargosync_user';
const AUTH_ROLE_KEY = '@cargosync_role';
const AUTH_COMPANY_KEY = '@cargosync_company';
const AUTH_EMPLOYEES_KEY = '@cargosync_employees';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock company and employees for demonstration
const initialCompany: Company = {
  id: 'cmp_apex_logistics',
  legalName: 'Apex Multimodal Logistics Pvt Ltd',
  businessType: 'Private Limited',
  gstin: '07AABCA1234F1Z8',
  registeredAddress: '402 Cyber City, Phase III, Gurugram, Haryana 122002',
  fleetSize: 18,
  adminId: 'usr_admin_01',
  verificationStatus: 'verified',
  createdAt: '2026-01-15T09:00:00Z',
};

const initialEmployees: CompanyEmployee[] = [
  {
    id: 'emp_01',
    companyId: 'cmp_apex_logistics',
    name: 'Rajesh Sharma',
    email: 'rajesh.s@apexlogistics.in',
    phone: '+91 98101 23456',
    role: 'admin',
    status: 'active',
    invitedAt: '2026-01-15T09:00:00Z',
    joinedAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'emp_02',
    companyId: 'cmp_apex_logistics',
    name: 'Vikram Singh',
    email: 'vikram.singh@apexlogistics.in',
    phone: '+91 98202 34567',
    role: 'fleet_manager',
    status: 'active',
    invitedAt: '2026-01-16T10:00:00Z',
    joinedAt: '2026-01-16T11:00:00Z',
  },
  {
    id: 'emp_03',
    companyId: 'cmp_apex_logistics',
    name: 'Balwinder Dhillon',
    email: 'balwinder.d@apexlogistics.in',
    phone: '+91 98303 45678',
    role: 'driver',
    status: 'active',
    invitedAt: '2026-01-20T14:00:00Z',
    joinedAt: '2026-01-20T15:30:00Z',
  },
  {
    id: 'emp_04',
    companyId: 'cmp_apex_logistics',
    name: 'Amit Patel',
    email: 'amit.p@apexlogistics.in',
    phone: '+91 98404 56789',
    role: 'dispatcher',
    status: 'pending',
    invitedAt: '2026-02-01T12:00:00Z',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<CompanyEmployee[]>(initialEmployees);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const storedRole = await AsyncStorage.getItem(AUTH_ROLE_KEY);
      const storedCompany = await AsyncStorage.getItem(AUTH_COMPANY_KEY);
      const storedEmployees = await AsyncStorage.getItem(AUTH_EMPLOYEES_KEY);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRole) setRole(storedRole as UserRole);
      if (storedCompany) setCompany(JSON.parse(storedCompany));
      if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
    } catch (e) {
      console.error('Error restoring auth state', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrPhone: string, targetRole: UserRole = 'shipper') => {
    setIsLoading(true);
    try {
      const query = emailOrPhone.toLowerCase();
      const matched =
        mockUsers.find((u) => u.email.toLowerCase() === query || u.phone.includes(query)) ||
        mockUsers.find((u) => u.role === targetRole) ||
        mockUsers[0];

      const activeUser: User = {
        ...matched,
        role: targetRole,
        accountType: targetRole === 'company_admin' ? 'company' : 'individual',
        verificationStatus: 'verified',
      };

      setUser(activeUser);
      setRole(targetRole);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(activeUser));
      await AsyncStorage.setItem(AUTH_ROLE_KEY, targetRole);

      if (targetRole === 'company_admin') {
        setCompany(initialCompany);
        await AsyncStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(initialCompany));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    phone: string,
    targetRole: UserRole
  ) => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone,
        role: targetRole,
        accountType: targetRole === 'company_admin' ? 'company' : 'individual',
        companyName: targetRole === 'company_admin' ? 'My Logistics Company' : undefined,
        verificationStatus: 'pending',
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setRole(targetRole);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      await AsyncStorage.setItem(AUTH_ROLE_KEY, targetRole);
    } finally {
      setIsLoading(false);
    }
  };

  const onboardIndividual = async (params: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    cityHub?: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        name: params.name,
        email: params.email,
        phone: params.phone,
        role: params.role,
        accountType: 'individual',
        cityHub: params.cityHub,
        verificationStatus: 'pending',
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setRole(params.role);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      await AsyncStorage.setItem(AUTH_ROLE_KEY, params.role);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (params: {
    legalName: string;
    businessType: string;
    gstin: string;
    registeredAddress: string;
    fleetSize?: number;
  }): Promise<Company> => {
    setIsLoading(true);
    try {
      const newCompany: Company = {
        id: `cmp_${Date.now().toString().slice(-6)}`,
        legalName: params.legalName,
        businessType: params.businessType,
        gstin: params.gstin,
        registeredAddress: params.registeredAddress,
        fleetSize: params.fleetSize || 0,
        adminId: user?.id || `usr_admin_${Date.now().toString().slice(-4)}`,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Company creator automatically becomes company_admin
      const updatedUser: User = {
        ...(user || {
          id: newCompany.adminId,
          name: 'Company Admin',
          email: 'admin@company.com',
          phone: '+91 98000 00000',
        }),
        role: 'company_admin',
        accountType: 'company',
        companyId: newCompany.id,
        companyName: newCompany.legalName,
        companyRole: 'admin',
        verificationStatus: 'pending',
      };

      setUser(updatedUser);
      setRole('company_admin');
      setCompany(newCompany);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      await AsyncStorage.setItem(AUTH_ROLE_KEY, 'company_admin');
      await AsyncStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(newCompany));

      return newCompany;
    } finally {
      setIsLoading(false);
    }
  };

  const joinCompanyByCode = async (code: string): Promise<{ success: boolean; companyName?: string }> => {
    // Simulated validation of 6-character code
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length === 6) {
      const companyName = 'Apex Multimodal Logistics';
      const updatedUser: User = {
        ...(user || {
          id: `usr_${Date.now().toString().slice(-6)}`,
          name: 'Employee User',
          email: 'user@apexlogistics.in',
          phone: '+91 99999 11111',
        }),
        role: 'fleet',
        accountType: 'company',
        companyId: 'cmp_apex_logistics',
        companyName,
        companyRole: 'member',
        verificationStatus: 'verified',
      };

      setUser(updatedUser);
      setRole('fleet');
      setCompany(initialCompany);

      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      await AsyncStorage.setItem(AUTH_ROLE_KEY, 'fleet');
      await AsyncStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(initialCompany));
      return { success: true, companyName };
    }
    return { success: false };
  };

  const inviteEmployee = async (params: {
    name: string;
    email: string;
    phone: string;
    role: EmployeeRole;
  }): Promise<CompanyEmployee> => {
    const newEmp: CompanyEmployee = {
      id: `emp_${Date.now().toString().slice(-5)}`,
      companyId: company?.id || 'cmp_current',
      name: params.name,
      email: params.email,
      phone: params.phone,
      role: params.role,
      status: 'pending',
      invitedAt: new Date().toISOString(),
    };
    const updated = [newEmp, ...employees];
    setEmployees(updated);
    await AsyncStorage.setItem(AUTH_EMPLOYEES_KEY, JSON.stringify(updated));
    return newEmp;
  };

  const updateEmployeeRole = async (employeeId: string, newRole: EmployeeRole) => {
    const updated = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, role: newRole } : emp
    );
    setEmployees(updated);
    await AsyncStorage.setItem(AUTH_EMPLOYEES_KEY, JSON.stringify(updated));
  };

  const removeEmployee = async (employeeId: string) => {
    const updated = employees.filter((emp) => emp.id !== employeeId);
    setEmployees(updated);
    await AsyncStorage.setItem(AUTH_EMPLOYEES_KEY, JSON.stringify(updated));
  };

  const updateVerificationStatus = async (status: VerificationStatus) => {
    if (user) {
      const updatedUser = { ...user, verificationStatus: status };
      setUser(updatedUser);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    }
    if (company) {
      const updatedCompany = { ...company, verificationStatus: status };
      setCompany(updatedCompany);
      await AsyncStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(updatedCompany));
    }
  };

  const selectRole = async (targetRole: UserRole) => {
    setRole(targetRole);
    if (user) {
      const updated: User = { ...user, role: targetRole };
      setUser(updated);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    }
    await AsyncStorage.setItem(AUTH_ROLE_KEY, targetRole);
  };

  const switchRole = async (targetRole: UserRole) => {
    await selectRole(targetRole);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setRole(null);
      setCompany(null);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
      await AsyncStorage.removeItem(AUTH_ROLE_KEY);
      await AsyncStorage.removeItem(AUTH_COMPANY_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        company,
        employees,
        isAuthenticated: !!user && !!role,
        isLoading,
        login,
        signUp,
        selectRole,
        switchRole,
        onboardIndividual,
        registerCompany,
        joinCompanyByCode,
        inviteEmployee,
        updateEmployeeRole,
        removeEmployee,
        updateVerificationStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
