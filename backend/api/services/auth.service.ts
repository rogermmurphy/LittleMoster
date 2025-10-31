/**
 * Authentication Service
 * Handles user registration, login, password hashing, and JWT token generation
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
const JWT_EXPIRATION = process.env['JWT_EXPIRATION'] || '15m';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret';
const JWT_REFRESH_EXPIRATION = process.env['JWT_REFRESH_EXPIRATION'] || '7d';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access token
   */
  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION } as jwt.SignOptions);
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION } as jwt.SignOptions);
  }

  /**
   * Verify access token
   */
  public verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Register new user
   */
  public async register(data: RegisterData) {
    // Check if email already exists
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Generate username from email if not provided
    const username = data.email.split('@')[0];
    
    // Check if generated username already exists
    const { data: existingUsername } = await this.supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    // If username exists, append random number
    const finalUsername = existingUsername 
      ? `${username}${Math.floor(Math.random() * 1000)}`
      : username;

    // Create full name from firstName and lastName
    const fullName = data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.firstName || data.lastName || data.email.split('@')[0];

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert({
        email: data.email,
        username: finalUsername,
        full_name: fullName,
        password_hash: passwordHash,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to create user');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.full_name
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Login user
   */
  public async login(data: LoginData) {
    // Find user by email
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(data.password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last active timestamp
    await this.supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', user.id);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        state: user.state,
        gradeLevel: user.grade_level,
        schoolName: user.school_name
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token
   */
  public async refreshAccessToken(refreshToken: string) {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Verify user still exists and is active
    const { data: user, error } = await this.supabase
      .from('users')
      .select('id, email, username, is_active')
      .eq('id', payload.userId)
      .single();

    if (error || !user || !user.is_active) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    return {
      accessToken: newAccessToken
    };
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('id, email, username, full_name, state, grade_level, school_name, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      state: user.state,
      gradeLevel: user.grade_level,
      schoolName: user.school_name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at
    };
  }
}
