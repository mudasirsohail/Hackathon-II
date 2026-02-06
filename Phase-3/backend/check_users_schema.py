#!/usr/bin/env python3
"""
Script to check the users table schema.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect

# Load environment variables
load_dotenv()

# Import the engine
from src.models.database import engine

def check_users_schema():
    inspector = inspect(engine)
    columns = inspector.get_columns('users')
    print('Users table schema:')
    for col in columns:
        print(f'  {col["name"]}: {col["type"]}')

if __name__ == "__main__":
    check_users_schema()