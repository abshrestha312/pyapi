import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuditAction, TicketState } from '@prisma/client'

const validStateTransitions: Record<TicketState, TicketState[]> = {
  NEW: ['IN_PROGRESS', 'REOPENED'],
  IN_PROGRESS: ['RESOLVED', 'REOPENED'],
  RESOLVED: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['IN_PROGRESS', 'RESOLVED']
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Get ticket error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { state, priority, assignedToId, workNotes, shortDescription, description } = body

    // Get current ticket
    const currentTicket = await prisma.ticket.findUnique({
      where: { id: params.id }
    })

    if (!currentTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Validate state transition if state is being changed
    if (state && state !== currentTicket.state) {
      const allowedStates = validStateTransitions[currentTicket.state as TicketState]
      if (!allowedStates.includes(state as TicketState)) {
        return NextResponse.json({
          error: `Invalid state transition from ${currentTicket.state} to ${state}`
        }, { status: 400 })
      }
    }

    const updateData: any = {}
    const oldValues: any = {}
    const newValues: any = {}

    if (shortDescription !== undefined) {
      oldValues.shortDescription = currentTicket.shortDescription
      newValues.shortDescription = shortDescription
      updateData.shortDescription = shortDescription
    }

    if (description !== undefined) {
      oldValues.description = currentTicket.description
      newValues.description = description
      updateData.description = description
    }

    if (state && state !== currentTicket.state) {
      oldValues.state = currentTicket.state
      newValues.state = state
      updateData.state = state
    }

    if (priority && priority !== currentTicket.priority) {
      oldValues.priority = currentTicket.priority
      newValues.priority = priority
      updateData.priority = priority
    }

    if (assignedToId !== undefined && assignedToId !== currentTicket.assignedToId) {
      oldValues.assignedToId = currentTicket.assignedToId
      newValues.assignedToId = assignedToId
      updateData.assignedToId = assignedToId
    }

    if (workNotes) {
      updateData.workNotes = workNotes
    }

    // Update ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    // Create audit logs for changes
    if (Object.keys(oldValues).length > 0) {
      let auditAction = AuditAction.UPDATE
      let description = 'Updated ticket'

      if (oldValues.state && newValues.state) {
        auditAction = AuditAction.STATE_CHANGE
        description = `Changed state from ${oldValues.state} to ${newValues.state}`
      } else if (oldValues.assignedToId !== undefined) {
        auditAction = AuditAction.ASSIGNMENT_CHANGE
        description = 'Changed ticket assignment'
      }

      await prisma.auditLog.create({
        data: {
          userId,
          action: auditAction,
          entityType: 'ticket',
          entityId: params.id,
          description,
          oldValues,
          newValues,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    }

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Update ticket error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    await prisma.ticket.delete({
      where: { id: params.id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.DELETE,
        entityType: 'ticket',
        entityId: params.id,
        description: `Deleted ticket: ${ticket.shortDescription}`,
        oldValues: {
          shortDescription: ticket.shortDescription,
          state: ticket.state,
          priority: ticket.priority
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Delete ticket error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}