import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getUserFromCookies = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const setAuthCookie = (response, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/'
  };

  response.cookies.set('auth-token', token, cookieOptions);
  return response;
};

export const clearAuthCookie = (response) => {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  return response;
};

export const requireAuth = async (handler) => {
  return async (request, ...args) => {
    const user = await getUserFromCookies();
    
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    request.user = user;
    return handler(request, ...args);
  };
};


export const requireRole = (allowedRoles) => {
  return async (handler) => {
    return async (request, ...args) => {
      const user = await getUserFromCookies();
      
      if (!user) {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!allowedRoles.includes(user.role)) {
        return Response.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      request.user = user;
      return handler(request, ...args);
    };
  };
};