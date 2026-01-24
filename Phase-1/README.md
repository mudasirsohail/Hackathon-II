# In-Memory TODO Console App

A command-line TODO application that allows users to manage tasks during runtime. Built with Python and follows Spec-Driven Development (SDD) methodology during Hackathon 2 Phase 1.

## Features

This console application provides a complete TODO management system with 8 menu options:

1. **Add Task** - Create new tasks with titles, descriptions, and priority levels
2. **View All Tasks** - Display all tasks with their details
3. **Mark Task Complete** - Update task completion status
4. **View Pending Tasks** - Filter and display only incomplete tasks
5. **View Completed Tasks** - Filter and display only completed tasks
6. **Filter Tasks by Priority** - Show tasks with a specific priority level
7. **Update Task Priority** - Modify priority level of existing tasks
8. **Exit** - Gracefully terminate the application

## Tech Stack

- **Programming Language**: Python 3
- **Architecture**: Clean Architecture following SDD principles
- **Data Storage**: In-memory (lists, dictionaries, classes)
- **Development Methodology**: Spec-Driven Development (SDD)
- **Tools**: Python Standard Library only (no external dependencies)

## Spec-Driven Development (SDD)

This project was developed using the Spec-Driven Development approach, which emphasizes:

- Creating detailed specifications before implementation
- Defining clear acceptance criteria for each feature
- Following a systematic design process (data models, system design, edge cases)
- Maintaining alignment with original requirements throughout development
- Ensuring all implementation follows the predefined console contract

This methodology helped ensure predictable development outcomes and high-quality code that meets all specified requirements.

## How to Run

1. **Prerequisites**: Ensure you have Python 3 installed on your system

2. **Clone or download the repository**

3. **Run the application**:
   ```bash
   python todo_app.py
   ```

4. **Follow the on-screen menu prompts** to manage your tasks

## Sample Console Output

```
========================================
         TODO CONSOLE APP
========================================
1. Add Task
2. View All Tasks
3. Mark Task Complete
4. View Pending Tasks
5. View Completed Tasks
6. Filter Tasks by Priority
7. Update Task Priority
8. Exit
========================================
Enter your choice (1-8):
```

## Project Constraints

- **In-Memory Storage**: All data is stored only in memory (lists, dictionaries, classes)
- **No File System Usage**: No files are saved to or loaded from the disk
- **Data Loss on Exit**: All tasks are lost when the application terminates
- **Console-Only Interface**: No GUI - operates entirely through the command line
- **Python Standard Library Only**: No external dependencies or third-party packages

## Learning Outcomes

Through this project, we explored:

- Clean Architecture principles with clear separation of concerns
- In-memory data management techniques
- Spec-Driven Development methodology
- Console application design and user experience
- Error handling and edge case management
- Object-oriented programming in Python
- Task management system design patterns

## Hackathon Context

This application was developed as part of Hackathon 2 Phase 1, demonstrating the effectiveness of Spec-Driven Development in creating well-structured, predictable applications under time constraints. The project showcases how following a systematic approach to specification before implementation can lead to clean, maintainable code that meets all requirements.

## License

This project is available for educational and reference purposes.

---
*Built with Python, SpecifyPlus, and Qwen CLI using Spec-Driven Development methodology*