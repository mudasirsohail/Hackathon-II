import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    const debugInfo = {
      hasDatabaseUrl: !!databaseUrl,
      databaseUrlLength: databaseUrl?.length || 0,
      databaseUrlPrefix: databaseUrl?.substring(0, 20) || "undefined",
      databaseUrlSuffix: databaseUrl ? databaseUrl.substring(Math.max(0, databaseUrl.length - 20)) : "undefined",
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('DATABASE')),
      fullDatabaseUrlPreview: databaseUrl ?
        `${databaseUrl.substring(0, 50)}...${databaseUrl.substring(databaseUrl.length - 20)}` :
        "undefined",
      isLiteralString: databaseUrl === "$DATABASE_URL" || databaseUrl?.includes("$DATABASE_URL"),
      sampleOfEnvVars: Object.fromEntries(
        Object.entries(process.env)
          .filter(([key]) => key.includes('DATABASE') || key.includes('NEXTAUTH') || key.includes('VERCEL'))
          .slice(0, 10) // Limit to first 10 matching env vars
      )
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug env error:', error);
    return NextResponse.json({
      error: 'Failed to retrieve environment variables',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}