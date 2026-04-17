import { Link, NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/books">
            Books Admin
          </Link>
          <div className="navbar-nav">
            <NavLink
              to="/books"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Books
            </NavLink>
            <NavLink
              to="/books/new"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Create
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  )
}
