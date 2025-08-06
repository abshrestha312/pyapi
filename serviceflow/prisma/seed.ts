import { PrismaClient, AuditAction } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default roles
  console.log('📝 Creating roles...')
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system administrator access',
      permissions: {
        admin: true,
        user_management: true,
        role_management: true,
        group_management: true,
        ticket_management: true,
        incident_management: true,
        user_impersonation: true,
        audit_logs: true,
        system_settings: true
      }
    }
  })

  const agentRole = await prisma.role.upsert({
    where: { name: 'Agent' },
    update: {},
    create: {
      name: 'Agent',
      description: 'Service desk agent with ticket handling permissions',
      permissions: {
        ticket_management: true,
        incident_management: true,
        ticket_assignment: true,
        work_notes: true
      }
    }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'End User' },
    update: {},
    create: {
      name: 'End User',
      description: 'Standard end user with basic access',
      permissions: {
        ticket_create: true,
        ticket_view_own: true
      }
    }
  })

  // Create default groups
  console.log('👥 Creating groups...')
  const itSupportGroup = await prisma.group.upsert({
    where: { name: 'IT Support' },
    update: {},
    create: {
      name: 'IT Support',
      description: 'IT Support and Help Desk team'
    }
  })

  const devOpsGroup = await prisma.group.upsert({
    where: { name: 'DevOps' },
    update: {},
    create: {
      name: 'DevOps',
      description: 'Development Operations team'
    }
  })

  const endUsersGroup = await prisma.group.upsert({
    where: { name: 'End Users' },
    update: {},
    create: {
      name: 'End Users',
      description: 'Standard end users'
    }
  })

  // Create test users
  console.log('👤 Creating users...')
  const hashedPassword = await hashPassword('ServiceFlow@123')

  const testUser1 = await prisma.user.upsert({
    where: { email: 'testuser1@serviceflow.com' },
    update: {},
    create: {
      name: 'Test Admin User',
      email: 'testuser1@serviceflow.com',
      password: hashedPassword,
      roleId: adminRole.id,
      groupId: itSupportGroup.id,
      isActive: true
    }
  })

  const testAgent = await prisma.user.upsert({
    where: { email: 'agent@serviceflow.com' },
    update: {},
    create: {
      name: 'Service Agent',
      email: 'agent@serviceflow.com',
      password: hashedPassword,
      roleId: agentRole.id,
      groupId: itSupportGroup.id,
      isActive: true
    }
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'user@serviceflow.com' },
    update: {},
    create: {
      name: 'End User',
      email: 'user@serviceflow.com',
      password: hashedPassword,
      roleId: userRole.id,
      groupId: endUsersGroup.id,
      isActive: true
    }
  })

  // Create sample tickets
  console.log('🎫 Creating sample tickets...')
  const ticket1 = await prisma.ticket.create({
    data: {
      shortDescription: 'Password reset request',
      description: 'User needs password reset for their domain account. Unable to access email or phone for self-service reset.',
      state: 'NEW',
      priority: 'MEDIUM',
      createdById: testUser.id,
      assignedToId: testAgent.id,
      workNotes: 'Initial ticket creation'
    }
  })

  const ticket2 = await prisma.ticket.create({
    data: {
      shortDescription: 'Software installation request',
      description: 'Need Microsoft Office 365 installed on new laptop for marketing department.',
      state: 'IN_PROGRESS',
      priority: 'LOW',
      createdById: testUser.id,
      assignedToId: testAgent.id,
      workNotes: 'Laptop received, installing software package'
    }
  })

  const ticket3 = await prisma.ticket.create({
    data: {
      shortDescription: 'Network connectivity issues',
      description: 'Intermittent network drops in Building A, 3rd floor. Multiple users affected.',
      state: 'RESOLVED',
      priority: 'HIGH',
      createdById: testAgent.id,
      assignedToId: testUser1.id,
      workNotes: 'Replaced faulty network switch. Monitoring for 24h. No issues reported.'
    }
  })

  // Create sample incidents
  console.log('🚨 Creating sample incidents...')
  const incident1 = await prisma.incident.create({
    data: {
      shortDescription: 'Email server outage',
      description: 'Complete email server outage affecting all users. Exchange server appears to be down.',
      state: 'IN_PROGRESS',
      priority: 'CRITICAL',
      classification: 'Major Incident',
      createdById: testAgent.id,
      assignedToId: testUser1.id,
      workNotes: 'Investigating root cause. Failover server initiated.'
    }
  })

  const incident2 = await prisma.incident.create({
    data: {
      shortDescription: 'Security breach attempt',
      description: 'Suspicious login attempts detected from unknown IP addresses. Potential security breach.',
      state: 'RESOLVED',
      priority: 'CRITICAL',
      classification: 'Security Incident',
      createdById: testUser1.id,
      assignedToId: testUser1.id,
      workNotes: 'IP addresses blocked. Security team notified. No data compromise detected.'
    }
  })

  // Create some audit logs
  console.log('📋 Creating audit logs...')
  await prisma.auditLog.create({
    data: {
      userId: testUser1.id,
      action: AuditAction.CREATE,
      entityType: 'user',
      entityId: testUser.id,
      description: 'Created new user account',
      newValues: { name: testUser.name, email: testUser.email },
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceFlow Seed Script'
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: testAgent.id,
      action: AuditAction.STATE_CHANGE,
      entityType: 'ticket',
      entityId: ticket2.id,
      description: 'Changed ticket state from NEW to IN_PROGRESS',
      oldValues: { state: 'NEW' },
      newValues: { state: 'IN_PROGRESS' },
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceFlow Seed Script'
    }
  })

  console.log('✅ Database seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Roles: ${await prisma.role.count()}`)
  console.log(`- Groups: ${await prisma.group.count()}`)
  console.log(`- Users: ${await prisma.user.count()}`)
  console.log(`- Tickets: ${await prisma.ticket.count()}`)
  console.log(`- Incidents: ${await prisma.incident.count()}`)
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`)
  
  console.log('\n🔐 Test Credentials:')
  console.log('Admin User:')
  console.log('  Email: testuser1@serviceflow.com')
  console.log('  Password: ServiceFlow@123')
  console.log('\nAgent User:')
  console.log('  Email: agent@serviceflow.com')
  console.log('  Password: ServiceFlow@123')
  console.log('\nEnd User:')
  console.log('  Email: user@serviceflow.com')
  console.log('  Password: ServiceFlow@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })