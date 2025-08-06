import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuditAction } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (userId) {
      // Create audit log for logout
      await prisma.auditLog.create({
        data: {
          userId,
          action: AuditAction.LOGOUT,
          entityType: 'user',
          entityId: userId,
          description: 'User logged out',
          ipAddress: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    }

    // Clear the auth cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}