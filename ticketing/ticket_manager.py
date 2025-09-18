#!/usr/bin/env python3
"""
Ticket Manager
Handles CRUD operations and persistence for tickets
"""

import json
import os
from typing import List, Dict, Optional, Any
from datetime import datetime

from ticket import Ticket, TicketStatus, TicketPriority


class TicketManager:
    """Manages tickets with file-based persistence"""
    
    def __init__(self, data_file: str = "tickets.json"):
        """
        Initialize the ticket manager
        
        Args:
            data_file: Path to the JSON file for storing tickets
        """
        self.data_file = data_file
        self.tickets: Dict[str, Ticket] = {}
        self.load_tickets()
    
    def load_tickets(self):
        """Load tickets from the JSON file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    for ticket_data in data.get('tickets', []):
                        ticket = Ticket.from_dict(ticket_data)
                        self.tickets[ticket.id] = ticket
                print(f"Loaded {len(self.tickets)} tickets from {self.data_file}")
            except (json.JSONDecodeError, KeyError, ValueError) as e:
                print(f"Error loading tickets: {e}")
                print("Starting with empty ticket database")
                self.tickets = {}
        else:
            print(f"No existing ticket file found. Starting fresh.")
            self.tickets = {}
    
    def save_tickets(self):
        """Save tickets to the JSON file"""
        try:
            data = {
                'tickets': [ticket.to_dict() for ticket in self.tickets.values()],
                'last_updated': datetime.now().isoformat()
            }
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Saved {len(self.tickets)} tickets to {self.data_file}")
        except Exception as e:
            print(f"Error saving tickets: {e}")
    
    def create_ticket(self, title: str, description: str = "", 
                     priority: TicketPriority = TicketPriority.MEDIUM,
                     assigned_to: str = "", category: str = "General") -> Ticket:
        """Create a new ticket"""
        ticket = Ticket(title, description, priority, assigned_to, category)
        self.tickets[ticket.id] = ticket
        self.save_tickets()
        print(f"Created ticket #{ticket.id}: {title}")
        return ticket
    
    def get_ticket(self, ticket_id: str) -> Optional[Ticket]:
        """Get a ticket by ID"""
        return self.tickets.get(ticket_id)
    
    def update_ticket(self, ticket_id: str, **kwargs) -> bool:
        """Update ticket properties"""
        ticket = self.get_ticket(ticket_id)
        if not ticket:
            print(f"Ticket {ticket_id} not found")
            return False
        
        updated = False
        if 'title' in kwargs:
            ticket.title = kwargs['title']
            updated = True
        if 'description' in kwargs:
            ticket.description = kwargs['description']
            updated = True
        if 'priority' in kwargs:
            ticket.priority = kwargs['priority']
            updated = True
        if 'category' in kwargs:
            ticket.category = kwargs['category']
            updated = True
        
        if updated:
            ticket.updated_at = datetime.now()
            self.save_tickets()
            print(f"Updated ticket #{ticket_id}")
        
        return updated
    
    def delete_ticket(self, ticket_id: str) -> bool:
        """Delete a ticket"""
        if ticket_id in self.tickets:
            del self.tickets[ticket_id]
            self.save_tickets()
            print(f"Deleted ticket #{ticket_id}")
            return True
        else:
            print(f"Ticket {ticket_id} not found")
            return False
    
    def list_tickets(self, status: Optional[TicketStatus] = None,
                    assigned_to: Optional[str] = None,
                    category: Optional[str] = None,
                    priority: Optional[TicketPriority] = None) -> List[Ticket]:
        """List tickets with optional filtering"""
        tickets = list(self.tickets.values())
        
        if status:
            tickets = [t for t in tickets if t.status == status]
        if assigned_to:
            tickets = [t for t in tickets if t.assigned_to.lower() == assigned_to.lower()]
        if category:
            tickets = [t for t in tickets if t.category.lower() == category.lower()]
        if priority:
            tickets = [t for t in tickets if t.priority == priority]
        
        # Sort by creation date (newest first)
        tickets.sort(key=lambda t: t.created_at, reverse=True)
        return tickets
    
    def search_tickets(self, query: str) -> List[Ticket]:
        """Search tickets by title, description, or comments"""
        query = query.lower()
        results = []
        
        for ticket in self.tickets.values():
            if (query in ticket.title.lower() or 
                query in ticket.description.lower() or
                any(query in comment['comment'].lower() for comment in ticket.comments)):
                results.append(ticket)
        
        results.sort(key=lambda t: t.created_at, reverse=True)
        return results
    
    def get_stats(self) -> Dict[str, Any]:
        """Get ticket statistics"""
        total = len(self.tickets)
        if total == 0:
            return {"total": 0}
        
        status_counts = {}
        priority_counts = {}
        category_counts = {}
        assignee_counts = {}
        
        for ticket in self.tickets.values():
            # Status counts
            status = ticket.status.value
            status_counts[status] = status_counts.get(status, 0) + 1
            
            # Priority counts
            priority = ticket.priority.value
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
            
            # Category counts
            category = ticket.category
            category_counts[category] = category_counts.get(category, 0) + 1
            
            # Assignee counts
            assignee = ticket.assigned_to or "Unassigned"
            assignee_counts[assignee] = assignee_counts.get(assignee, 0) + 1
        
        return {
            "total": total,
            "by_status": status_counts,
            "by_priority": priority_counts,
            "by_category": category_counts,
            "by_assignee": assignee_counts
        }
    
    def export_tickets(self, filename: str, status: Optional[TicketStatus] = None):
        """Export tickets to a JSON file"""
        tickets_to_export = self.list_tickets(status=status)
        
        data = {
            'exported_at': datetime.now().isoformat(),
            'filter_status': status.value if status else 'all',
            'count': len(tickets_to_export),
            'tickets': [ticket.to_dict() for ticket in tickets_to_export]
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Exported {len(tickets_to_export)} tickets to {filename}")
    
    def bulk_update_status(self, ticket_ids: List[str], new_status: TicketStatus, comment: str = ""):
        """Update status for multiple tickets"""
        updated_count = 0
        for ticket_id in ticket_ids:
            ticket = self.get_ticket(ticket_id)
            if ticket:
                ticket.update_status(new_status, comment)
                updated_count += 1
        
        if updated_count > 0:
            self.save_tickets()
            print(f"Updated status for {updated_count} tickets to {new_status.value}")
        
        return updated_count