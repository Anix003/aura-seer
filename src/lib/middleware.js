import { getUserFromCookies } from '@/lib/auth';

export const withAuth = (handler) => {
  return async (request, ...args) => {
    try {
      const user = await getUserFromCookies();
      
      if (!user) {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      request.user = user;
      return handler(request, ...args);
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      return Response.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
};

export const withRole = (allowedRoles) => {
  return (handler) => {
    return withAuth(async (request, ...args) => {
      const user = request.user;
      
      if (!allowedRoles.includes(user.role)) {
        return Response.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request, ...args);
    });
  };
};

export const withValidation = (schema) => {
  return (handler) => {
    return async (request, ...args) => {
      try {
        const body = await request.json();
        
        for (const field of schema.required || []) {
          if (!body[field]) {
            return Response.json(
              { error: `${field} is required` },
              { status: 400 }
            );
          }
        }

        request.validatedBody = body;
        return handler(request, ...args);
        
      } catch (error) {
        return Response.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }
    };
  };
};

export const withErrorHandler = (handler) => {
  return async (request, ...args) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('API Error:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return Response.json(
          { error: validationErrors.join(', ') },
          { status: 400 }
        );
      }

      if (error.code === 11000) {
        return Response.json(
          { error: 'Duplicate entry detected' },
          { status: 409 }
        );
      }

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
};

export const combineMiddleware = (...middlewares) => {
  return (handler) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
};