import { Context, Hono, Next } from 'hono';
// import jwt from 'jsonwebtoken';
// import { Pool } from 'pg';
import { AppVariables } from './types/hono.types';
// import { User, UserLogin } from './types/User.type';
import { googleAuth } from '@hono/oauth-providers/google';
// import { CookieStore } from 'hono-sessions';
// import { setCookie } from 'hono/cookie';

const auth = new Hono<{ Variables: AppVariables }>();
// const JWT_SECRET = Bun.env.JWT_SECRET;
// const JWT_EXPIRES_IN = Bun.env.JWT_EXPIRES_IN;

// const sessionStore = new CookieStore();

const googleAuthMiddleware = googleAuth({
	client_id: Bun.env.GOOGLE_CLIENT_ID,
	client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
	scope: [
		'openid',
		'email',
		'profile',
		'https://www.googleapis.com/auth/calendar.events'
	],
	// Optional: If you want to store the refresh token
	// access_type: 'offline', 
	// prompt: 'consent', // Forces consent screen, useful for getting refresh token
	redirect_uri: `${Bun.env.HOST}:${Bun.env.PORT}/auth/google/callback`,
	// onError: (c, error) => {
	//    console.error("Google OAuth Error:", error);
	//    return c.redirect(`${APP_BASE_URL}/?oauth_error=${encodeURIComponent(error.message || 'Login failed')}`);
	// }
});

// Route to initiate Google OAuth login
auth.get('/google', googleAuthMiddleware);

// Callback route for Google OAuth. The middleware will handle the token exchange
auth.get(
	'/google/callback',
	googleAuthMiddleware,
	async (c) => {
		try {
			const session = c.get('session');
			const token = c.get('token'); // Access token from Google
			const user = c.get('user-google'); // User profile from Google

			if (!user || !user.id) {
				console.error('Google OAuth callback: User data not found or missing ID.');
				return c.redirect(`${Bun.env.HOST}:${Bun.env.PORT}/?oauth_error=User data incomplete`);
			}

			// Store user profile and create a session
			session.set('user',
				{
					id: user.id,
					name: user.name,
					email: user.email,
					picture: user.picture,
					accessToken: token!.token,
					// You might store the access token and refresh token here if needed for API calls
					// refreshToken: token!.refresh_token, 
					// tokenExpiresAt: Date.now() + (token.expires_in * 1000)
				});

			console.log('User successfully authenticated:', user.name);
			return c.redirect(`${Bun.env.ALLOWED_ORIGIN}/admin`);

		} catch (error) {
			console.error('Error in Google OAuth callback:', error);
			// The onError handler in googleAuth might catch this first, but good to have a fallback.
			return c.redirect(`${Bun.env.HOST}`);
		}
	}
);

/**
 *  GET request to check existing credentials. It will return the user 
 *  data if it exists, and an error otherwise
 */
auth.get('/verify', (c) => { // No authGuard needed here, we're just checking
	const user = c.get('session')?.get('user');

	if (user) {
		return c.json({ isAuthenticated: true, user }); // Send back user data if logged in
	}
	return c.json({ isAuthenticated: false }, 401); // Indicate not authenticated
});
// /**
//  *  POST request to login. It will perform a check of username
//  *  and a password hash using a PostgreSQL custom function
//  */
// auth.post('/login', async (c) => {
// 	const pool: Pool = c.get('db');

// 	try {
// 		const data = await c.req.formData();
// 		const userLogin: UserLogin = {
// 			username: data.get('username')!.toString(),
// 			password: data.get('password')!.toString()
// 		};
// 		const result = await pool.query(
// 			`
//             SELECT  
//                 *
//             FROM 
//                 authenticate_user($1, $2);`,
// 			[userLogin.username, userLogin.password]
// 		);

// 		if (result.rows.length === 0 || result.rows[0].username !== userLogin.username) {
// 			return c.json({ error: 'Invalid credentials.' }, 401);
// 		}

// 		const user: User = result.rows[0];

// 		// Generate JWT
// 		// @ts-ignore
// 		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
// 			expiresIn: JWT_EXPIRES_IN
// 		});
// 		return c.json({ token, user }, 200);
// 	} catch (error) {
// 		console.error('Database error: ', error);
// 		return c.json({ error: 'Login failed' }, 500);
// 	}
// });

// /**
//  *  POST request to change password. It will perform a check of username
//  *  and a password hash using a PostgreSQL custom function
//  */
// auth.post('/reset', async (c) => {
// 	const pool: Pool = c.get('db');

// 	try {
// 		const data = await c.req.formData();
// 		const user: UserLogin & { oldPassword: string } = {
// 			username: data.get('username')!.toString(),
// 			oldPassword: data.get('oldPassword')!.toString(),
// 			password: data.get('password')!.toString()
// 		};
// 		const result = await pool.query(
// 			`
//             SELECT  
//                 *
//             FROM 
//                 reset_password($1, $2, $3);`,
// 			[user.username, user.oldPassword, user.password]
// 		);

// 		return c.json(result.rows[0], 200);
// 	} catch (error) {
// 		console.error('Database error: ', error);
// 		return c.json({ error: 'Login failed' }, 500);
// 	}
// });

// auth.post('/verify_token', async (c) => {
// 	try {
// 		const data = await c.req.formData();
// 		const token = data.get('token')?.toString();

// 		const decoded = jwt.verify(token, JWT_SECRET);

// 		return c.json({ message: 'Token is valid!' }, 200);
// 	} catch (error) {
// 		console.error('Error during token verification: ', error);
// 		return c.json({ error: 'Token verification error' }, 500);
// 	}
// });

// export const authGuard = async (c: Context<{ Variables: AppVariables }>, next: Next) => {
// 	const authHeader = c.req.header('Authorization');

// 	if (!authHeader || !authHeader.startsWith('Bearer ')) {
// 		return c.json({ error: 'Unauthorized' }, 401);
// 	}

// 	const token = authHeader.split(' ')[1];

// 	try {
// 		const decoded = jwt.verify(token, JWT_SECRET) as User;
// 		c.set('user', decoded);
// 		await next();
// 	} catch (error) {
// 		return c.json({ error: 'Invalid or expired token' }, 401);
// 	}
// };

export const authGuard = async (c: Context<{ Variables: AppVariables }>, next: Next) => {
	// Retrieve the user data stored in the session.
	// We assume you stored it under the key 'user' during login, as in the previous example: c.session.set('user', userData);
	const user = c.get('session')?.get('user');

	if (user) {
		// User is authenticated
		// Optional: You can set the user object directly on the context if you prefer c.var.user over c.session.get('user') in your route handlers
		// c.set('user', user); // Or c.set('currentUser', user);
		await next(); // Proceed to the next handler (your protected route logic)
	} else {
		// User is not authenticated, or session has expired/is invalid
		// hono-sessions handles expiry automatically based on your sessionMiddleware configuration
		return c.json({ message: 'Unauthorized. Please log in.' }, 401);
	}
};

export default auth;
