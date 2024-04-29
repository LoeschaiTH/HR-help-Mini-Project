import * as React from "react";

import { createRoot } from "react-dom/client";
import Signln from './page/SignIn'
import AuthCheck from "./auth/AuthCheck";
import Dashboard from "./page/Dashboard";
import Layouts from "./Componect/Layout";
import Calendar from './page/Calendar';
import FullCalendar from './page/FullCalendar';
import Public_relations from './page/Public_relations';
import PdfViewer from "./Componect/PdfViewer";


import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>PN</h1>
        <Link to="/Signln">Signln</Link><br/>
        {/* <Link to="/Dashboard">Dashboard</Link><br/> */}
        <Link to="/FullCalendar">FullCalendar</Link><br/>
        {/* <Link to="/Calendar">Calendar</Link><br/> */}
        <Link to="/Public_relations">Public relations</Link>
      </div>
    ),
  },
  {
    path: "Signln",
    element: <div><Signln /></div>,
  },
  {
    path: "Dashboard",
    element: (
      <AuthCheck>
        <Layouts>
          <Dashboard />
        </Layouts>
      </AuthCheck>
    ),
  },
  {
    path: "Dashboard/:form",
    element: (
      <AuthCheck>
        <Layouts>
          <Dashboard />
        </Layouts>
      </AuthCheck>
    ),
  },
  {
    path: "FullCalendar",
    element: <div><FullCalendar /></div>,
  },
  {
    path: "Calendar",
    element: <div><Calendar /></div>,
  },
  {
    path: "Public_relations",
    element: <div><Public_relations/></div>,
  },
  {
    path:"/Public_relations/PdfViewer/:ID_publicized",
    element:<div><PdfViewer/></div>
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
