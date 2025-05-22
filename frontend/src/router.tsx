// router.tsx
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import NotFound from "./views/NotFound";
import Login from "./views/Login";
import Signup from "./views/Signup";
import GoogleCallBack from "./views/GoogleCallBack";
import UserSettings from "./views/UserSettings";
import CourseCreator from "./views/CourseCreator";
import DisplayCourse from "./views/DisplayCourse";
import ExerciseManager from "./views/ExerciseManager";
import CourseManager from "./views/CourseManager";
import StudentExercises from "./views/StudentExercises.tsx";
import Home from "./views/Home.tsx";
import StudentExerciseDisplay from "./views/StudentExerciseDisplay.tsx";
import Forbidden from "./views/Forbidden.tsx";
import StudentSolutions from "./views/StudentSolutions.tsx";
import EmailVerification from "./views/EmailVerification.tsx";

function AppRouter() {
    const { user } = useStateContext();
    console.log("AppRouter: user =", user);
    const teacherRoutes = [
        { path: 'exerciseManager', element: <ExerciseManager /> },
        { path: 'courseManager', element: <CourseManager /> },
        { path: '/', element: <Home/> },
    ];

    const studentRoutes = [
        { path: 'solution', element: <StudentSolutions /> },
        { path: 'settings', element: <UserSettings /> },
        { path: 'exercises', element: <StudentExercises /> },
        { path: 'course/:courseId/exercise/:exerciseId',element: <StudentExerciseDisplay />},
        { path: 'course/:courseId/exercise/:exerciseId',element: <StudentExerciseDisplay />},
        { path: '/', element: <Home/> },
    ];

    const commonRoutes = [
        { path: 'course', element: <CourseCreator /> },
        { path: 'displayCourse', element: <DisplayCourse /> },
        { path: '/email/verify/:id/:hash', element: <EmailVerification /> },

    ];

    const isAuthenticated = !!user;

    const router = createBrowserRouter([
        {
            path: '/',
            element: isAuthenticated ? <DefaultLayout /> : <GuestLayout />,
            children: isAuthenticated
                ? [
                    ...(user.employee_type === 'teacher'
                        ? [...teacherRoutes, ...commonRoutes]
                        : [...studentRoutes, ...commonRoutes]),
                    { path: '403', element: <Forbidden /> },
                    { path: '*', element: <NotFound /> },
                ]
                : [
                    { path: 'login', element: <Login /> },
                    { path: 'signup', element: <Signup /> },
                    { path: 'auth/google', element: <GoogleCallBack /> },
                    { path: '/', element: <Navigate to="/login" /> },
                    { path: '403', element: <Forbidden /> },
                    { path: '*', element: <NotFound /> },
                ],
        },
    ]);


    return <RouterProvider router={router} />;
}

export default AppRouter;
