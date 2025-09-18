#!/usr/bin/env python3
"""
Ticket Management System
Core ticket class and related functionality
"""

import json
import uuid
from datetime import datetime
from enum import Enum
from typing import List, Dict, Optional, Any


class TicketStatus(Enum):
    """Enumeration for ticket statuses"""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    ON_HOLD = "on_hold"


class TicketPriority(Enum):
    """Enumeration for ticket priorities"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Ticket:
    """Core ticket class for the ticketing system"""
    
    def __init__(self, title: str, description: str = "", 
                 priority: TicketPriority = TicketPriority.MEDIUM,
                 assigned_to: str = "", category: str = "General"):
        """
        Initialize a new ticket
        
        Args:
            title: Brief description of the issue
            description: Detailed description of the issue
            priority: Priority level of the ticket
            assigned_to: Person assigned to handle the ticket
            category: Category/type of the ticket
        """
        self.id = str(uuid.uuid4())[:8]  # Short UUID for readability
        self.title = title
        self.description = description
        self.status = TicketStatus.OPEN
        self.priority = priority
        self.assigned_to = assigned_to
        self.category = category
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.comments: List[Dict[str, Any]] = []
        self.tags: List[str] = []
    
    def add_comment(self, comment: str, author: str = "System"):
        """Add a comment to the ticket"""
        comment_data = {
            "id": str(uuid.uuid4())[:8],
            "comment": comment,
            "author": author,
            "timestamp": datetime.now().isoformat()
        }
        self.comments.append(comment_data)
        self.updated_at = datetime.now()
    
    def update_status(self, new_status: TicketStatus, comment: str = ""):
        """Update the ticket status"""
        old_status = self.status.value
        self.status = new_status
        self.updated_at = datetime.now()
        
        status_comment = f"Status changed from '{old_status}' to '{new_status.value}'"
        if comment:
            status_comment += f". Note: {comment}"
        
        self.add_comment(status_comment, "System")
    
    def assign_to(self, assignee: str, comment: str = ""):
        """Assign the ticket to someone"""
        old_assignee = self.assigned_to or "Unassigned"
        self.assigned_to = assignee
        self.updated_at = datetime.now()
        
        assign_comment = f"Ticket reassigned from '{old_assignee}' to '{assignee}'"
        if comment:
            assign_comment += f". Note: {comment}"
        
        self.add_comment(assign_comment, "System")
    
    def add_tag(self, tag: str):
        """Add a tag to the ticket"""
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()
    
    def remove_tag(self, tag: str):
        """Remove a tag from the ticket"""
        if tag in self.tags:
            self.tags.remove(tag)
            self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ticket to dictionary for serialization"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status.value,
            "priority": self.priority.value,
            "assigned_to": self.assigned_to,
            "category": self.category,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "comments": self.comments,
            "tags": self.tags
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Ticket':
        """Create ticket from dictionary"""
        ticket = cls(
            title=data["title"],
            description=data["description"],
            priority=TicketPriority(data["priority"]),
            assigned_to=data["assigned_to"],
            category=data["category"]
        )
        
        ticket.id = data["id"]
        ticket.status = TicketStatus(data["status"])
        ticket.created_at = datetime.fromisoformat(data["created_at"])
        ticket.updated_at = datetime.fromisoformat(data["updated_at"])
        ticket.comments = data["comments"]
        ticket.tags = data["tags"]
        
        return ticket
    
    def __str__(self) -> str:
        """String representation of the ticket"""
        return (f"Ticket {self.id}: {self.title}\n"
                f"Status: {self.status.value.title()} | "
                f"Priority: {self.priority.value.title()} | "
                f"Assigned: {self.assigned_to or 'Unassigned'}\n"
                f"Created: {self.created_at.strftime('%Y-%m-%d %H:%M')}")
    
    def detailed_view(self) -> str:
        """Detailed string representation of the ticket"""
        details = [
            f"{'='*60}",
            f"TICKET #{self.id}",
            f"{'='*60}",
            f"Title: {self.title}",
            f"Category: {self.category}",
            f"Status: {self.status.value.title()}",
            f"Priority: {self.priority.value.title()}",
            f"Assigned To: {self.assigned_to or 'Unassigned'}",
            f"Created: {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}",
            f"Updated: {self.updated_at.strftime('%Y-%m-%d %H:%M:%S')}",
            f"",
            f"Description:",
            f"{self.description or 'No description provided'}",
            f"",
            f"Tags: {', '.join(self.tags) if self.tags else 'None'}",
            f"",
            f"Comments ({len(self.comments)}):",
            f"{'-'*40}"
        ]
        
        for comment in self.comments:
            timestamp = datetime.fromisoformat(comment["timestamp"]).strftime('%Y-%m-%d %H:%M')
            details.extend([
                f"[{timestamp}] {comment['author']}:",
                f"  {comment['comment']}",
                f""
            ])
        
        if not self.comments:
            details.append("No comments yet")
        
        details.append(f"{'='*60}")
        
        return "\n".join(details)