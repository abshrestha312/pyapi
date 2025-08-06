import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuditAction } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const state = searchParams.get('state')
    const priority = searchParams.get('priority')

    const skip = (page - 1) * limit

    const where: any = {}
    if (state) where.state = state
    if (priority) where.priority = priority

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          assignedTo: { select: { name: true, email: true } },
          createdBy: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.ticket.count({ where })
    ])

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shortDescription, description, priority, assignedToId } = body

    if (!shortDescription) {
      return NextResponse.json(
        { error: 'Short description is required' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        shortDescription,
        description,
        priority: priority || 'MEDIUM',
        assignedToId,
        createdById: userId,
        state: 'NEW'
      },
      include: {
        assignedTo: { select: { name: true, email: true } },
        createdBy: { select: { name: true, email: true } }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.CREATE,
        entityType: 'ticket',
        entityId: ticket.id,
        description: `Created ticket: ${shortDescription}`,
        newValues: {
          shortDescription,
          description,
          priority: ticket.priority,
          state: ticket.state
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}