import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router'
import { routes } from './routes.tsx'

const router = import.meta.env.VITE_GITHUB_PAGES === 'true'
  ? createHashRouter(routes)
  : createBrowserRouter(routes)

export function App() {
  return <RouterProvider router={router} />
}
