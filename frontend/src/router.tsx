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
import StudentExerciseDisplay from "./views/StudentExerciseDisplay.tsx";
import Forbidden from "./views/Forbidden.tsx";
import StudentSolutions from "./views/StudentSolutions.tsx";
import EmailVerification from "./views/EmailVerification.tsx";
import ForgotPassword from "./views/ForgotPassword.tsx";
import ResetPassword from "./views/ResetPassword.tsx";

function AppRouter() {
    const { user } = useStateContext();
    const isAuthenticated = !!user;

    const teacherRoutes = [
        { path: 'exerciseManager', element: <ExerciseManager /> },
        { path: 'courseManager', element: <CourseManager /> },
    ];

    const studentRoutes = [
        { path: 'solution', element: <StudentSolutions /> },
        { path: 'exercises', element: <StudentExercises /> },
        { path: 'course/:courseId/exercise/:exerciseId', element: <StudentExerciseDisplay /> },
    ];

    const commonRoutes = [
        { path: 'course', element: <CourseCreator /> },
        { path: 'displayCourse', element: <DisplayCourse /> },
        { path: 'email/verify/:id/:hash', element: <EmailVerification /> },
        { path: 'settings', element: <UserSettings /> },
        { index: true, element: <UserSettings /> },
    ];

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
                    { path: 'forgot-password', element: <ForgotPassword /> },
                    { path: 'reset-password/:token', element: <ResetPassword /> },
                    { index: true, element: <Navigate to="/login" /> }, // Redirect / to /login
                    { path: '*', element: <Navigate to="/login" /> },  // Redirect unknown to /login
                ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default AppRouter;
