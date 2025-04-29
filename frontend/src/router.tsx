import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.tsx";
import Signup from "./views/Signup.tsx";
import NotFound from "./views/NotFound.tsx";
import DefaultLayout from "./components/DefaultLayout.tsx";
import GuestLayout from "./components/GuestLayout.tsx";
import SolutionDisplay from "./views/SolutionDisplay.tsx";
import GoogleCallBack from "./views/GoogleCallBack.tsx";
import UserSettings from "./views/UserSettings.tsx";
import CourseCreator from "./views/CourseCreator.tsx";
import DisplayCourse from "./views/DisplayCourse.tsx";
import ExerciseManager from "./views/ExerciseManager.tsx";
import CourseManager from "./views/CourseManager.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/exerciseManager',
                element: <ExerciseManager />
            },
            {
                path: '/courseManager',
                element: <CourseManager />
            },
            {
                path: '/solution',
                element: <SolutionDisplay />
            },
            {
                path: '/settings',
                element: <UserSettings/>
            },
            {
                path: '/course',
                element: <CourseCreator/>
            },
            {
                path: '/displayCourse',
                element: <DisplayCourse/>
            },
            {
                path: '/',
                element: <ExerciseManager/>
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login', // Relative path (no leading '/')
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/',
                element: <Navigate to ='/login'/>
            },
            {
                path:'/auth/google',
                element: <GoogleCallBack />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
