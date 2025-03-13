import {createBrowserRouter, Navigate} from "react-router-dom";
import ExerciseCreator from "./views/ExerciseCreator.tsx";
import ExerciseDisplay from "./views/ExerciseDisplay.tsx";
import NotFound from "./views/NotFound.tsx";
import DefaultLayout from "./components/DefaultLayout.tsx";
import GuestLayout from "./components/GuestLayout.tsx";
import SolutionDisplay from "./views/SolutionDisplay.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/create',
                element : <ExerciseCreator/>
            },
            {
                path: '/display',
                element : <ExerciseDisplay/>
            },
            {
                path: '/solution',
                element : <SolutionDisplay/>
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/',
                element : <Navigate to="/create" />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound/>
    }

])

export default  router
