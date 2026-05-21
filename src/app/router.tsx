import LoginPage from '@/features/auth/pages/LoginPage'
import LandingPage from '@/features/landing/pages/LandingPage'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

// Layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'))

// Pages — lazy load theo từng module để tối ưu bundle
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'))
const TaskPage = lazy(() => import('@/features/task/pages/TaskPage'))
const TaskDetailPage = lazy(() => import('@/features/task/pages/TaskDetailPage'))
const LMSDashboardPage = lazy(() => import('@/features/lms/pages/LMSDashboardPage'))
const LMSCatalogPage = lazy(() => import('@/features/lms/pages/LMSCatalogPage'))
const CourseDetailPage = lazy(() => import('@/features/lms/pages/CourseDetailPage'))
const LessonPlayerPage = lazy(() => import('@/features/lms/pages/LessonPlayerPage'))
const QuizPage = lazy(() => import('@/features/lms/pages/QuizPage'))
const LearnerProgressPage = lazy(() => import('@/features/lms/pages/LearnerProgressPage'))

// Guard: chỉ cho vào nếu đã đăng nhập
function ProtectedRoute() {
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
  return <Outlet /> // DEV ONLY: bypass auth
}

const PageFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

export const router = createBrowserRouter([
  // Landing page (public)
  {
    path: '/',
    element: (
      <Suspense fallback={<PageFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },
  // Auth routes
  {
    element: (
      <Suspense fallback={<PageFallback />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  // Protected app routes
  {
    element: <ProtectedRoute />,
    children: [
      // Full-screen routes (no sidebar)
      {
        path: '/lms/course/:courseId/quiz/:quizId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <QuizPage />
          </Suspense>
        ),
      },
      {
        path: '/lms/course/:courseId/lesson/:lessonId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <LessonPlayerPage />
          </Suspense>
        ),
      },
      {
        element: (
          <Suspense fallback={<PageFallback />}>
            <AppLayout />
          </Suspense>
        ),
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/chat', element: <ChatPage /> },
          { path: '/task', element: <TaskPage /> },
          { path: '/task/:id', element: <Suspense fallback={<PageFallback />}><TaskDetailPage /></Suspense> },
          { path: '/lms', element: <Suspense fallback={<PageFallback />}><LMSDashboardPage /></Suspense> },
          { path: '/lms/explore', element: <Suspense fallback={<PageFallback />}><LMSCatalogPage /></Suspense> },
          { path: '/lms/course/:id', element: <Suspense fallback={<PageFallback />}><CourseDetailPage /></Suspense> },
          { path: '/lms/course/:id/learn', element: <Suspense fallback={<PageFallback />}><LessonPlayerPage /></Suspense> },
          { path: '/lms/progress', element: <Suspense fallback={<PageFallback />}><LearnerProgressPage /></Suspense> },
        ],
      },
    ],
  },
])
