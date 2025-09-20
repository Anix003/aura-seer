import { clearAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const response = Response.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    return clearAuthCookie(response);

  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: 'Internal server error during logout' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request);
}