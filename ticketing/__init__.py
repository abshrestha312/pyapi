"""
Ticketing System Package
A comprehensive ticket management system with CLI interface
"""

from .ticket import Ticket, TicketStatus, TicketPriority
from .ticket_manager import TicketManager
from .ticketing_cli import TicketingCLI

__version__ = "1.0.0"
__all__ = ["Ticket", "TicketStatus", "TicketPriority", "TicketManager", "TicketingCLI"]