**D.O.Z. SCRUM BOARD MANAGER**

\_**\_ INTRODUCTION \_\_**

This app is an assignment for the course Javascript 2, as part of the Backend program at Grit Academy. The task is to create a website for managing _scrum boards_.

■ Developer Team:
○ Diana Mihaela Paragina - UI/UX Designer, Database Manager, Backend Engineer
○ Oskar Calais - Git Admin, Frontend Developer, QA Manager
○ Zana Ibrahim - UI/UX Designer, Backend engineer, QA Manager

\_**\_ FUNCTIONALITY \_\_**

■ Functionality (_Project View_):
○ Projects can be added in the app and each project includes _Project Name_, _Description_, _Deadline_ and _Members_
○ New members can be added, and each member must enter _Name_ and one or more _Categories_
○ The main view of the project board shows the _Project Name_, _Description_, _Deadline_ and _Members_ (including each member's _Name_, _Category_ and how many _Tasks_ in progress they are assigned) as well as associated _Tasks_

■ Functionality (_Tasks_ and _Scrum Board_):
○ The Scrum Board has four columns; _Backlog_, _In Progress_, _In Review_ and _Done_
○ Each _Task_ has the following attributes:
• _Title_
• _Description_
• _Category_
• _Date Added_
• _Deadline_ (Can be changed)
• _Priority_ [Low (green), Moderate (yellow), High (orange), Critical (Red)]
• _Assigned Member_ (When a team member is assigned, the _Task_ changes status from _Backlog_ to _In Progress_)
• _Send to review_-button (Only available for tasks with _In Progress_-status)
• _Mark as done_-button (Only available for tasks with _In Review_-status)
• _Archive_-button (Only available for tasks with _Done_-status)
○ New tasks can be added via _Add Task_-button. The user adding a task must enter:
• _Title_
• _Description_
• _Category_
• _Priority_ [Low (green), Moderate (yellow), High (orange), Critical (Red)]
• _Deadline_
• Other attributes are added via the code

■ Filtering and Sorting
○ Tasks can be filtered by _Priority_, _Assigned Member_, _Category_, _Deadline_ or _Date Added_ (ascending or descending)

■ Development:
○ Coding is done with TypeScript
○ Styling is done in Tailwind
○ Database is made in Firebase Realtime Database (WebSocket)
○ Object-Oriented Programming (OOP) is employed
○ The web application is bundled with Vite and deployed with Netflify.

\_**\_ BRANCH STRATEGY \_\_**

■ Main branches: _main > developer_

■ Supporting branches
Name template: [developer]-[type]-[scope]-[name]
Ex:
• john-feature-css-global
• jane-docs-readme-checklist
