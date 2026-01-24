class Task:
    """Represents a task in the TODO list."""
    
    def __init__(self, task_id, title, description="", priority=5, completed=False):
        """
        Initialize a task with the given attributes.
        
        Args:
            task_id (int): Unique identifier for the task
            title (str): Title of the task (required)
            description (str): Description of the task (optional)
            priority (int): Priority level (1-10, default 5)
            completed (bool): Completion status (default False)
        """
        self.id = task_id
        self.title = title.strip()
        self.description = description.strip()
        self.priority = priority
        self.completed = completed
    
    def __str__(self):
        """String representation of the task."""
        status = "Completed" if self.completed else "Pending"
        return f"{self.id:2d} | {self.title:18s} | {self.priority:8d} | {status:7s}"


class TodoApp:
    """Main application class for the TODO console app."""
    
    def __init__(self):
        """Initialize the application with an empty task list and ID counter."""
        self.tasks = []
        self.next_id = 1
    
    def add_task(self, title, description="", priority=5):
        """
        Add a new task to the list.
        
        Args:
            title (str): Task title (required)
            description (str): Task description (optional)
            priority (int): Priority level (1-10, default 5)
        
        Returns:
            bool: True if task was added successfully, False otherwise
        """
        if not title or not title.strip():
            return False
        
        # Validate priority range
        if priority < 1 or priority > 10:
            priority = 5  # Use default if invalid
        
        task = Task(self.next_id, title.strip(), description.strip(), priority, False)
        self.tasks.append(task)
        self.next_id += 1
        return True
    
    def get_all_tasks(self):
        """Return a list of all tasks."""
        return self.tasks
    
    def get_pending_tasks(self):
        """Return a list of pending tasks."""
        return [task for task in self.tasks if not task.completed]
    
    def get_completed_tasks(self):
        """Return a list of completed tasks."""
        return [task for task in self.tasks if task.completed]
    
    def get_tasks_by_priority(self, priority):
        """Return a list of tasks with the specified priority."""
        return [task for task in self.tasks if task.priority == priority]
    
    def mark_task_complete(self, task_id):
        """
        Mark a task as complete.
        
        Args:
            task_id (int): ID of the task to mark complete
        
        Returns:
            bool: True if successful, False if task not found
        """
        for task in self.tasks:
            if task.id == task_id:
                task.completed = True
                return True
        return False
    
    def update_task_priority(self, task_id, new_priority):
        """
        Update the priority of a task.
        
        Args:
            task_id (int): ID of the task to update
            new_priority (int): New priority level (1-10)
        
        Returns:
            bool: True if successful, False if task not found
        """
        if new_priority < 1 or new_priority > 10:
            return False
        
        for task in self.tasks:
            if task.id == task_id:
                task.priority = new_priority
                return True
        return False
    
    def display_menu(self):
        """Display the main menu."""
        print("=" * 48)
        print("         TODO CONSOLE APP")
        print("=" * 48)
        print("1. Add Task")
        print("2. View All Tasks")
        print("3. Mark Task Complete")
        print("4. View Pending Tasks")
        print("5. View Completed Tasks")
        print("6. Filter Tasks by Priority")
        print("7. Update Task Priority")
        print("8. Exit")
        print("=" * 48)
    
    def display_tasks(self, tasks):
        """
        Display a list of tasks in a formatted table.
        
        Args:
            tasks (list): List of tasks to display
        """
        if not tasks:
            print("No tasks found.")
            return
        
        # Truncate long titles to fit the display format
        def truncate_title(title):
            if len(title) > 18:
                return title[:15] + "..."
            return title
        
        print("=" * 48)
        print("         TASK LIST")
        print("=" * 48)
        print("ID | Title              | Priority | Status")
        print("---|--------------------|----------|------------")
        
        for task in tasks:
            # Truncate title if needed
            truncated_title = truncate_title(task.title)
            display_task = Task(task.id, truncated_title, task.description, task.priority, task.completed)
            print(display_task)
        
        print("=" * 48)
    
    def get_user_input(self, prompt):
        """
        Get user input with basic error handling.
        
        Args:
            prompt (str): Prompt to display to the user
        
        Returns:
            str: User input or None if interrupted
        """
        try:
            return input(prompt).strip()
        except (EOFError, KeyboardInterrupt):
            print("\nApplication interrupted. Exiting...")
            return None
    
    def get_int_input(self, prompt):
        """
        Get an integer input from the user.
        
        Args:
            prompt (str): Prompt to display to the user
        
        Returns:
            int or None: Integer value or None if invalid input
        """
        user_input = self.get_user_input(prompt)
        if user_input is None:
            return None
        
        try:
            return int(user_input)
        except ValueError:
            return None
    
    def run(self):
        """Run the main application loop."""
        while True:
            self.display_menu()
            
            choice = self.get_int_input("Enter your choice (1-8): ")
            
            if choice is None:
                print("Error: Please enter a valid number.")
                continue
            
            if choice == 1:
                self.handle_add_task()
            elif choice == 2:
                self.handle_view_all_tasks()
            elif choice == 3:
                self.handle_mark_task_complete()
            elif choice == 4:
                self.handle_view_pending_tasks()
            elif choice == 5:
                self.handle_view_completed_tasks()
            elif choice == 6:
                self.handle_filter_tasks_by_priority()
            elif choice == 7:
                self.handle_update_task_priority()
            elif choice == 8:
                self.handle_exit()
                break
            else:
                print("Error: Invalid menu selection. Please enter a number between 1 and 8.")
    
    def handle_add_task(self):
        """Handle the add task operation."""
        title = self.get_user_input("Enter task title: ")
        if not title:
            print("Error: Task title cannot be empty. Please enter a valid title.")
            return
        
        description = self.get_user_input("Enter task description (optional): ")
        
        priority_input = self.get_user_input("Enter priority (1-10, default 5): ")
        priority = 5  # Default value
        if priority_input:
            try:
                priority = int(priority_input)
            except ValueError:
                print("Error: Priority must be between 1 and 10. Using default value of 5.")
        
        if self.add_task(title, description, priority):
            print(f"Task '{title}' added successfully with ID {self.next_id - 1}.")
        else:
            print("Error: Task title cannot be empty. Please enter a valid title.")
    
    def handle_view_all_tasks(self):
        """Handle the view all tasks operation."""
        tasks = self.get_all_tasks()
        self.display_tasks(tasks)
    
    def handle_mark_task_complete(self):
        """Handle the mark task complete operation."""
        task_id = self.get_int_input("Enter task number to mark complete: ")
        if task_id is None:
            print("Error: Please enter a valid number.")
            return
        
        # Check if task exists before trying to mark as complete
        task_exists = any(task.id == task_id for task in self.tasks)
        if not task_exists:
            print(f"Error: Task {task_id} does not exist. Please enter a valid task number.")
            return
        
        # Check if already completed
        for task in self.tasks:
            if task.id == task_id and task.completed:
                print(f"Task {task_id} is already marked as complete.")
                return
        
        if self.mark_task_complete(task_id):
            print(f"Task {task_id} marked as complete successfully.")
        else:
            print(f"Error: Task {task_id} does not exist. Please enter a valid task number.")
    
    def handle_view_pending_tasks(self):
        """Handle the view pending tasks operation."""
        tasks = self.get_pending_tasks()
        if not tasks:
            print("=" * 48)
            print("         TASK LIST")
            print("=" * 48)
            print("No pending tasks found.")
            print("=" * 48)
        else:
            self.display_tasks(tasks)
    
    def handle_view_completed_tasks(self):
        """Handle the view completed tasks operation."""
        tasks = self.get_completed_tasks()
        if not tasks:
            print("=" * 48)
            print("         TASK LIST")
            print("=" * 48)
            print("No completed tasks found.")
            print("=" * 48)
        else:
            self.display_tasks(tasks)
    
    def handle_filter_tasks_by_priority(self):
        """Handle the filter tasks by priority operation."""
        priority_input = self.get_user_input("Enter priority level to filter (1-10): ")
        if not priority_input:
            print("Error: Please enter a valid number.")
            return
        
        try:
            priority = int(priority_input)
            if priority < 1 or priority > 10:
                print("Error: Priority must be between 1 and 10.")
                return
        except ValueError:
            print("Error: Please enter a valid number.")
            return
        
        tasks = self.get_tasks_by_priority(priority)
        if not tasks:
            print(f"No tasks found with priority {priority}.")
        else:
            self.display_tasks(tasks)
    
    def handle_update_task_priority(self):
        """Handle the update task priority operation."""
        task_id = self.get_int_input("Enter task number to update: ")
        if task_id is None:
            print("Error: Please enter a valid number.")
            return
        
        # Check if task exists
        task_exists = any(task.id == task_id for task in self.tasks)
        if not task_exists:
            print(f"Error: Task {task_id} does not exist. Please enter a valid task number.")
            return
        
        new_priority = self.get_int_input("Enter new priority (1-10): ")
        if new_priority is None:
            print("Error: Please enter a valid number.")
            return
        
        try:
            new_priority = int(new_priority)
        except ValueError:
            print("Error: Please enter a valid number.")
            return
        
        if new_priority < 1 or new_priority > 10:
            print("Error: Priority must be between 1 and 10.")
            return
        
        if self.update_task_priority(task_id, new_priority):
            print(f"Task {task_id} priority updated to {new_priority} successfully.")
        else:
            print(f"Error: Task {task_id} does not exist. Please enter a valid task number.")
    
    def handle_exit(self):
        """Handle the exit operation."""
        print("Goodbye! Thanks for using TODO Console App.")


if __name__ == "__main__":
    app = TodoApp()
    app.run()