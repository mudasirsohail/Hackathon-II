#!/usr/bin/env python3
"""
Debug script to check the database connection and table names.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlmodel import Session, select

# Load environment variables
load_dotenv()

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.core.config import settings
from src.models.task import Task
from src.models.database import engine


def debug_database_detailed():
    """Debug the database connection and table names."""
    
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    print(f"DB_ECHO: {settings.DB_ECHO}")
    
    # Create a session
    with Session(engine) as session:
        # Check what tables exist
        print("\nChecking existing tables...")
        try:
            # For PostgreSQL/Neon, get table information
            result = session.exec(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.all()
            print(f"Tables in database: {[table[0] for table in tables]}")
        except Exception as e:
            print(f"Error getting table list: {e}")
        
        # Check specifically for 'todos' table
        try:
            result = session.exec(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'todos'
            """))
            columns = result.all()
            print(f"Columns in 'todos' table: {columns}")
        except Exception as e:
            print(f"'todos' table doesn't exist or error: {e}")
        
        # Check specifically for 'task' table
        try:
            result = session.exec(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'task'
            """))
            columns = result.all()
            print(f"Columns in 'task' table: {columns}")
        except Exception as e:
            print(f"'task' table doesn't exist or error: {e}")
        
        # Check if there are any records in 'todos' table
        try:
            result = session.exec(text("SELECT COUNT(*) FROM todos"))
            count = result.one()
            print(f"Number of records in 'todos' table: {count}")
        except Exception as e:
            print(f"Error querying 'todos' table: {e}")
        
        # Check if there are any records in 'task' table
        try:
            result = session.exec(text("SELECT COUNT(*) FROM task"))
            count = result.one()
            print(f"Number of records in 'task' table: {count}")
        except Exception as e:
            print(f"Error querying 'task' table: {e}")
        
        # Check all records in 'todos' table if it exists
        try:
            result = session.exec(text("SELECT * FROM todos"))
            records = result.all()
            print(f"All records in 'todos' table: {records}")
        except Exception as e:
            print(f"Error querying all records from 'todos' table: {e}")
        
        # Check all records in 'task' table if it exists
        try:
            result = session.exec(text("SELECT * FROM task"))
            records = result.all()
            print(f"All records in 'task' table: {records}")
        except Exception as e:
            print(f"Error querying all records from 'task' table: {e}")


if __name__ == "__main__":
    debug_database_detailed()