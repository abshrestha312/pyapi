#!/usr/bin/env python3
"""
Ticketing System CLI
Command-line interface for the ticket management system
"""

import argparse
import sys
from typing import Optional

from ticket import Ticket, TicketStatus, TicketPriority
from ticket_manager import TicketManager


class TicketingCLI:
    """Command-line interface for the ticketing system"""
    
    def __init__(self):
        self.manager = TicketManager()
    
    def create_ticket(self, args):
        """Create a new ticket"""
        priority = TicketPriority.MEDIUM
        if args.priority:
            try:
                priority = TicketPriority(args.priority.lower())
            except ValueError:
                print(f"Invalid priority: {args.priority}")
                print(f"Valid priorities: {[p.value for p in TicketPriority]}")
                return
        
        ticket = self.manager.create_ticket(
            title=args.title,
            description=args.description or "",
            priority=priority,
            assigned_to=args.assign or "",
            category=args.category or "General"
        )
        
        if args.tags:
            for tag in args.tags.split(','):
                ticket.add_tag(tag.strip())
            self.manager.save_tickets()
        
        print(f"\nTicket created successfully!")
        print(ticket)
    
    def list_tickets(self, args):
        """List tickets with optional filtering"""
        status = None
        if args.status:
            try:
                status = TicketStatus(args.status.lower())
            except ValueError:
                print(f"Invalid status: {args.status}")
                print(f"Valid statuses: {[s.value for s in TicketStatus]}")
                return
        
        priority = None
        if args.priority:
            try:
                priority = TicketPriority(args.priority.lower())
            except ValueError:
                print(f"Invalid priority: {args.priority}")
                return
        
        tickets = self.manager.list_tickets(
            status=status,
            assigned_to=args.assign,
            category=args.category,
            priority=priority
        )
        
        if not tickets:
            print("No tickets found matching the criteria.")
            return
        
        print(f"\nFound {len(tickets)} ticket(s):")
        print("=" * 80)
        
        for ticket in tickets:
            print(ticket)
            print("-" * 40)
    
    def show_ticket(self, args):
        """Show detailed view of a ticket"""
        ticket = self.manager.get_ticket(args.id)
        if not ticket:
            print(f"Ticket {args.id} not found")
            return
        
        print(ticket.detailed_view())
    
    def update_ticket(self, args):
        """Update a ticket"""
        ticket = self.manager.get_ticket(args.id)
        if not ticket:
            print(f"Ticket {args.id} not found")
            return
        
        updates = {}
        if args.title:
            updates['title'] = args.title
        if args.description:
            updates['description'] = args.description
        if args.priority:
            try:
                updates['priority'] = TicketPriority(args.priority.lower())
            except ValueError:
                print(f"Invalid priority: {args.priority}")
                return
        if args.category:
            updates['category'] = args.category
        
        if updates:
            self.manager.update_ticket(args.id, **updates)
        
        if args.assign:
            ticket.assign_to(args.assign, args.comment or "")
            self.manager.save_tickets()
        
        if args.status:
            try:
                new_status = TicketStatus(args.status.lower())
                ticket.update_status(new_status, args.comment or "")
                self.manager.save_tickets()
            except ValueError:
                print(f"Invalid status: {args.status}")
                return
        
        if args.tags:
            for tag in args.tags.split(','):
                ticket.add_tag(tag.strip())
            self.manager.save_tickets()
        
        print(f"Ticket #{args.id} updated successfully")
    
    def add_comment(self, args):
        """Add a comment to a ticket"""
        ticket = self.manager.get_ticket(args.id)
        if not ticket:
            print(f"Ticket {args.id} not found")
            return
        
        ticket.add_comment(args.comment, args.author or "User")
        self.manager.save_tickets()
        print(f"Comment added to ticket #{args.id}")
    
    def delete_ticket(self, args):
        """Delete a ticket"""
        if not args.force:
            confirm = input(f"Are you sure you want to delete ticket {args.id}? (y/N): ")
            if confirm.lower() != 'y':
                print("Deletion cancelled")
                return
        
        if self.manager.delete_ticket(args.id):
            print(f"Ticket #{args.id} deleted successfully")
    
    def search_tickets(self, args):
        """Search tickets"""
        tickets = self.manager.search_tickets(args.query)
        
        if not tickets:
            print(f"No tickets found matching '{args.query}'")
            return
        
        print(f"\nFound {len(tickets)} ticket(s) matching '{args.query}':")
        print("=" * 80)
        
        for ticket in tickets:
            print(ticket)
            print("-" * 40)
    
    def show_stats(self, args):
        """Show ticket statistics"""
        stats = self.manager.get_stats()
        
        print("\nTicket Statistics")
        print("=" * 50)
        print(f"Total Tickets: {stats['total']}")
        
        if stats['total'] == 0:
            return
        
        print(f"\nBy Status:")
        for status, count in stats['by_status'].items():
            print(f"  {status.title()}: {count}")
        
        print(f"\nBy Priority:")
        for priority, count in stats['by_priority'].items():
            print(f"  {priority.title()}: {count}")
        
        print(f"\nBy Category:")
        for category, count in stats['by_category'].items():
            print(f"  {category}: {count}")
        
        print(f"\nBy Assignee:")
        for assignee, count in stats['by_assignee'].items():
            print(f"  {assignee}: {count}")
    
    def export_tickets(self, args):
        """Export tickets to file"""
        status = None
        if args.status:
            try:
                status = TicketStatus(args.status.lower())
            except ValueError:
                print(f"Invalid status: {args.status}")
                return
        
        self.manager.export_tickets(args.filename, status)
    
    def run(self):
        """Run the CLI application"""
        parser = argparse.ArgumentParser(description="Ticket Management System")
        subparsers = parser.add_subparsers(dest='command', help='Available commands')
        
        # Create ticket command
        create_parser = subparsers.add_parser('create', help='Create a new ticket')
        create_parser.add_argument('title', help='Ticket title')
        create_parser.add_argument('-d', '--description', help='Ticket description')
        create_parser.add_argument('-p', '--priority', choices=['low', 'medium', 'high', 'critical'], help='Ticket priority')
        create_parser.add_argument('-a', '--assign', help='Assign ticket to someone')
        create_parser.add_argument('-c', '--category', help='Ticket category')
        create_parser.add_argument('-t', '--tags', help='Comma-separated tags')
        create_parser.set_defaults(func=self.create_ticket)
        
        # List tickets command
        list_parser = subparsers.add_parser('list', help='List tickets')
        list_parser.add_argument('-s', '--status', choices=['open', 'in_progress', 'resolved', 'closed', 'on_hold'], help='Filter by status')
        list_parser.add_argument('-p', '--priority', choices=['low', 'medium', 'high', 'critical'], help='Filter by priority')
        list_parser.add_argument('-a', '--assign', help='Filter by assignee')
        list_parser.add_argument('-c', '--category', help='Filter by category')
        list_parser.set_defaults(func=self.list_tickets)
        
        # Show ticket command
        show_parser = subparsers.add_parser('show', help='Show ticket details')
        show_parser.add_argument('id', help='Ticket ID')
        show_parser.set_defaults(func=self.show_ticket)
        
        # Update ticket command
        update_parser = subparsers.add_parser('update', help='Update a ticket')
        update_parser.add_argument('id', help='Ticket ID')
        update_parser.add_argument('-t', '--title', help='Update title')
        update_parser.add_argument('-d', '--description', help='Update description')
        update_parser.add_argument('-p', '--priority', choices=['low', 'medium', 'high', 'critical'], help='Update priority')
        update_parser.add_argument('-s', '--status', choices=['open', 'in_progress', 'resolved', 'closed', 'on_hold'], help='Update status')
        update_parser.add_argument('-a', '--assign', help='Assign to someone')
        update_parser.add_argument('-c', '--category', help='Update category')
        update_parser.add_argument('--tags', help='Add comma-separated tags')
        update_parser.add_argument('--comment', help='Add comment when updating')
        update_parser.set_defaults(func=self.update_ticket)
        
        # Add comment command
        comment_parser = subparsers.add_parser('comment', help='Add comment to ticket')
        comment_parser.add_argument('id', help='Ticket ID')
        comment_parser.add_argument('comment', help='Comment text')
        comment_parser.add_argument('-a', '--author', help='Comment author')
        comment_parser.set_defaults(func=self.add_comment)
        
        # Delete ticket command
        delete_parser = subparsers.add_parser('delete', help='Delete a ticket')
        delete_parser.add_argument('id', help='Ticket ID')
        delete_parser.add_argument('-f', '--force', action='store_true', help='Force delete without confirmation')
        delete_parser.set_defaults(func=self.delete_ticket)
        
        # Search tickets command
        search_parser = subparsers.add_parser('search', help='Search tickets')
        search_parser.add_argument('query', help='Search query')
        search_parser.set_defaults(func=self.search_tickets)
        
        # Statistics command
        stats_parser = subparsers.add_parser('stats', help='Show ticket statistics')
        stats_parser.set_defaults(func=self.show_stats)
        
        # Export command
        export_parser = subparsers.add_parser('export', help='Export tickets to file')
        export_parser.add_argument('filename', help='Output filename')
        export_parser.add_argument('-s', '--status', choices=['open', 'in_progress', 'resolved', 'closed', 'on_hold'], help='Export only tickets with this status')
        export_parser.set_defaults(func=self.export_tickets)
        
        args = parser.parse_args()
        
        if not args.command:
            parser.print_help()
            return
        
        try:
            args.func(args)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)


if __name__ == '__main__':
    cli = TicketingCLI()
    cli.run()