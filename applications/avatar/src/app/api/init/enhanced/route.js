import { initializeEnhancedDatabase } from '@/app/api/utils/enhanced-sql';

export async function POST(request) {
  try {
    console.log('Initializing enhanced Avatar database...');

    const result = await initializeEnhancedDatabase();

    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      return Response.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error in enhanced database initialization:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to initialize enhanced database',
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    return Response.json({
      success: true,
      message: 'Enhanced Avatar database initialization endpoint',
      available_methods: ['POST'],
      description:
        'Initialize enhanced database with advanced persona configurations, emotion analysis, and 3D avatar capabilities',
    });
  } catch (error) {
    console.error('Error in enhanced database status:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to get database status',
      },
      { status: 500 },
    );
  }
}



