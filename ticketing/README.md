# Ticket Management System

A comprehensive command-line ticket management system built in Python.

## Features

- **Create and manage tickets** with titles, descriptions, priorities, and assignments
- **Status tracking** (Open, In Progress, Resolved, Closed, On Hold)
- **Priority levels** (Low, Medium, High, Critical)
- **Comments and activity tracking** on tickets
- **Search and filtering** capabilities
- **Statistics and reporting**
- **JSON-based persistence** for data storage
- **Full command-line interface**

## Quick Start

### Basic Usage

```bash
# Create a new ticket
python ticketing_cli.py create "Fix login bug" -d "Users can't log in with special characters" -p high

# List all tickets
python ticketing_cli.py list

# Show detailed ticket view
python ticketing_cli.py show <ticket_id>

# Update ticket status
python ticketing_cli.py update <ticket_id> -s in_progress

# Add a comment
python ticketing_cli.py comment <ticket_id> "Working on this issue"

# Search tickets
python ticketing_cli.py search "login"

# Show statistics
python ticketing_cli.py stats
```

### Advanced Usage

```bash
# Create ticket with full details
python ticketing_cli.py create "Database optimization" \
  -d "Slow queries in user table" \
  -p high \
  -a "john.doe" \
  -c "Performance" \
  -t "database,performance,urgent"

# List tickets with filters
python ticketing_cli.py list -s open -p high -a "john.doe"

# Update multiple properties
python ticketing_cli.py update abc123 \
  -s in_progress \
  -a "jane.smith" \
  --comment "Reassigning to Jane"

# Export tickets
python ticketing_cli.py export tickets_backup.json -s open
```

## Ticket Properties

- **ID**: Unique 8-character identifier
- **Title**: Brief description of the issue
- **Description**: Detailed explanation
- **Status**: Current state (open, in_progress, resolved, closed, on_hold)
- **Priority**: Importance level (low, medium, high, critical)
- **Assigned To**: Person responsible for the ticket
- **Category**: Type/category of the ticket
- **Tags**: Searchable labels
- **Comments**: Activity log with timestamps
- **Created/Updated**: Automatic timestamps

## Command Reference

### Create Ticket
```bash
python ticketing_cli.py create "Title" [options]
  -d, --description    Ticket description
  -p, --priority      Priority (low|medium|high|critical)
  -a, --assign        Assign to person
  -c, --category      Ticket category
  -t, --tags          Comma-separated tags
```

### List Tickets
```bash
python ticketing_cli.py list [filters]
  -s, --status        Filter by status
  -p, --priority      Filter by priority
  -a, --assign        Filter by assignee
  -c, --category      Filter by category
```

### Show Ticket Details
```bash
python ticketing_cli.py show <ticket_id>
```

### Update Ticket
```bash
python ticketing_cli.py update <ticket_id> [options]
  -t, --title         Update title
  -d, --description   Update description
  -p, --priority      Update priority
  -s, --status        Update status
  -a, --assign        Assign to someone
  -c, --category      Update category
  --tags              Add tags
  --comment           Add comment with update
```

### Add Comment
```bash
python ticketing_cli.py comment <ticket_id> "Comment text"
  -a, --author        Comment author name
```

### Delete Ticket
```bash
python ticketing_cli.py delete <ticket_id>
  -f, --force         Skip confirmation
```

### Search Tickets
```bash
python ticketing_cli.py search "query"
```

### View Statistics
```bash
python ticketing_cli.py stats
```

### Export Tickets
```bash
python ticketing_cli.py export filename.json
  -s, --status        Export only tickets with specific status
```

## Data Storage

Tickets are stored in a `tickets.json` file in the same directory. The file contains:
- All ticket data in JSON format
- Automatic timestamps for tracking
- Comment history and activity logs

## Examples

### Typical Workflow

1. **Create a bug report**:
   ```bash
   python ticketing_cli.py create "Login page crashes on mobile" \
     -d "Users report crashes when trying to log in on iOS Safari" \
     -p high -c "Bug" -t "mobile,ios,login"
   ```

2. **Assign and start work**:
   ```bash
   python ticketing_cli.py update abc123 -s in_progress -a "developer1"
   ```

3. **Add progress updates**:
   ```bash
   python ticketing_cli.py comment abc123 "Identified the issue in CSS media queries"
   ```

4. **Mark as resolved**:
   ```bash
   python ticketing_cli.py update abc123 -s resolved --comment "Fixed CSS issue, deployed to staging"
   ```

5. **Close after verification**:
   ```bash
   python ticketing_cli.py update abc123 -s closed --comment "Verified fix in production"
   ```

## Integration

The system can be easily integrated into other Python applications:

```python
from ticketing import TicketManager, Ticket, TicketPriority

# Initialize manager
manager = TicketManager()

# Create ticket programmatically
ticket = manager.create_ticket(
    "API endpoint returning 500 error",
    description="The /api/users endpoint is failing",
    priority=TicketPriority.HIGH
)

# Update ticket
ticket.update_status(TicketStatus.IN_PROGRESS, "Started investigation")
```

This ticketing system provides a solid foundation for issue tracking and can be extended with additional features as needed.