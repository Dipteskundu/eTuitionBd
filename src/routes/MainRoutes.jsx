import React from 'react'
import { createBrowserRouter } from 'react-router'
import MainLayout from '../Layouts/MainLayouts.jsx/MainLayout'

const MainRoutes = createBrowserRouter([{
    path: '/',
    element: <MainLayout></MainLayout>,
    children: [{

    }]
}])

export default MainRoutes