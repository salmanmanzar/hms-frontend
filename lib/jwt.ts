interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'patient':
      return '/dashboard';
    case 'doctor':
      return '/dashboard/doctor';
    case 'receptionist':
      return '/dashboard/receptionist';
    case 'pharmacist':
      return '/dashboard/pharmacist';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/login';
  }
}