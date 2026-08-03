# 📚 Chat & Task Features - Developer Guide

## 🎯 Overview

Hướng dẫn này giúp team develop các feature **Chat** và **Task** theo structure đã định.

---

## 📁 Folder Structure

### Chat Feature
```
features/chat/
├── types/
│   └── chat.types.ts           # TypeScript interfaces
├── services/
│   └── chat.service.ts         # API calls
├── hooks/
│   ├── use-chat.ts             # Fetch conversations
│   └── use-messages.ts         # Manage messages
├── components/
│   ├── ChatWindow.tsx          # Main layout
│   ├── MessageList.tsx         # Messages display
│   └── MessageInput.tsx        # Input component
├── pages/
│   └── ChatPage.tsx            # Page entry
└── schemas/
    └── chat.schema.ts          # Zod validation
```

### Task Feature
```
features/task/
├── types/
│   └── task.types.ts           # TypeScript interfaces
├── services/
│   └── task.service.ts         # API calls
├── hooks/
│   ├── use-tasks.ts            # Fetch tasks
│   └── use-task-form.ts        # Form handling
├── components/
│   ├── TaskBoard.tsx           # Kanban board
│   ├── TaskCard.tsx            # Task card
│   └── TaskForm.tsx            # Form component
├── pages/
│   └── TaskPage.tsx            # Page entry
└── schemas/
    └── task.schema.ts          # Zod validation
```

---

## 🔄 Data Flow Pattern

### Chat Flow
```
ChatPage
  ↓
useChat() hook (fetch conversations)
  ↓
ChatWindow component (main UI)
  ↓
MessageList + MessageInput
  ↓
useMessages() hook (send/receive)
  ↓
chatService.sendMessage() (API call)
  ↓
Backend API
```

### Task Flow
```
TaskPage
  ↓
useTasks() hook (fetch tasks)
  ↓
TaskBoard component (Kanban view)
  ↓
TaskCard + TaskForm
  ↓
useTaskForm() hook (form management)
  ↓
taskService.createTask() (API call)
  ↓
Backend API
```

---

## ✅ Checklist cho Team

### Khi develop Chat feature:
- [ ] Implement real-time messaging với WebSocket
- [ ] Add message search functionality
- [ ] Add message reactions (emoji)
- [ ] Add file upload support
- [ ] Implement conversation grouping
- [ ] Add notification system

### Khi develop Task feature:
- [ ] Add drag & drop trong TaskBoard
- [ ] Implement task filtering & sorting
- [ ] Add task comments & attachments
- [ ] Add time tracking
- [ ] Implement role-based task permissions
- [ ] Add task templates

---

## 📋 Current Implementation Status

### ✅ Completed
- Basic folder structure
- TypeScript types defined
- Service layer setup (API patterns)
- Custom hooks for data fetching
- UI components (temporary)
- Form components with validation

### 🚧 In Progress / Todo
- Backend API implementation
- Real-time features (WebSocket)
- Advanced filtering & search
- Role-based access control
- File upload functionality
- Notification system
- Testing

---

## 🔧 Common Tasks

### Adding a new endpoint to chat service
```typescript
// services/chat.service.ts
export const chatService = {
  // Existing...
  
  // Add new endpoint
  markAsRead: (conversationId: string) =>
    axios.post(`${API_BASE}/conversations/${conversationId}/read`),
}
```

### Creating a new hook for messages
```typescript
// hooks/use-message-search.ts
export function useMessageSearch(query: string) {
  return useQuery({
    queryKey: ['messages-search', query],
    queryFn: () => chatService.searchMessages(conversationId, query),
    enabled: !!query && query.length > 2,
  })
}
```

### Adding new component
1. Create component file in `components/`
2. Export from component
3. Import & use in parent component
4. Add proper TypeScript types in `types/`

---

## 🛠️ Development Tips

### Use React Query for data fetching
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['unique-key'],
  queryFn: () => service.fetchData(),
})
```

### Handle mutations properly
```typescript
const mutation = useMutation({
  mutationFn: (payload) => service.update(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['data'] })
  },
})
```

### Form validation with Zod
```typescript
const schema = z.object({
  title: z.string().min(1),
})

const validated = schema.parse(formData)
```

---

## 📞 API Endpoints Expected

### Chat Endpoints
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:id` - Get conversation
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations/:id/messages` - Get messages
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/:id` - Update message
- `DELETE /api/chat/messages/:id` - Delete message

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/my` - Get my tasks
- `POST /api/tasks/:id/comments` - Add comment

---

## 🎨 UI Components Used

### Existing shadcn/ui components
- `Button`
- `Input`
- `Label`
- `Select`
- `Textarea`
- `Badge`
- `ScrollArea`

### Add missing components if needed
```bash
pnpm dlx shadcn@latest add [component-name]
```

---

## 🚀 Next Steps

1. **Backend API Setup** - Implement endpoints
2. **WebSocket Integration** - Real-time chat
3. **Permissions & Roles** - Role-based access
4. **File Upload** - Support attachments
5. **Testing** - Unit & integration tests
6. **Documentation** - API documentation

---

## 💡 Best Practices

✅ Keep components small and focused  
✅ Use TypeScript for type safety  
✅ Implement proper error handling  
✅ Use React Query for server state  
✅ Write reusable hooks  
✅ Follow naming conventions  
✅ Document complex logic  
✅ Test edge cases  

---

## 📚 Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Validation](https://zod.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hooks Best Practices](https://react.dev/reference/rules-of-hooks)

---

## ❓ Questions?

Tham khảo:
- PROJECT_STRUCTURE.md - Project overview
- Feature types files - Interface definitions
- Service files - API patterns
- Hook files - Data fetching patterns
