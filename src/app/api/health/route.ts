import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const timestamp = new Date().toISOString();
    
    // Check environment
    const nodeEnv = process.env.NODE_ENV;
    
    // Database connectivity check (if applicable)
    let databaseStatus = 'not-configured';
    if (process.env.DATABASE_URL) {
      databaseStatus = 'configured';
      // TODO: Add actual database ping when migrating from JSON
    }

    const healthData = {
      status: 'healthy',
      timestamp,
      environment: nodeEnv,
      database: databaseStatus,
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime(),
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
