import { NextRequest, NextResponse } from 'next/server';
import { DomainService } from '@/lib/domains';

export async function POST(request: NextRequest) {
  try {
    const { businessSlug, customDomain } = await request.json();

    if (!businessSlug || !customDomain) {
      return NextResponse.json(
        { error: 'Business slug and custom domain are required' },
        { status: 400 }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9-]+\.(com|net|org|co\.uk|com\.au|ca)$/;
    if (!domainRegex.test(customDomain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Create custom domain mapping
    const domain = await DomainService.createCustomDomain(businessSlug, customDomain);

    return NextResponse.json({
      success: true,
      domain,
      message: 'Custom domain created successfully'
    });

  } catch (error) {
    console.error('Error creating custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to create custom domain' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessSlug = searchParams.get('businessSlug');

    if (!businessSlug) {
      return NextResponse.json(
        { error: 'Business slug is required' },
        { status: 400 }
      );
    }

    const domain = await DomainService.getCustomDomain(businessSlug);

    return NextResponse.json({
      success: true,
      domain,
      defaultUrl: DomainService.getDefaultUrl(businessSlug)
    });

  } catch (error) {
    console.error('Error fetching custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom domain' },
      { status: 500 }
    );
  }
} 