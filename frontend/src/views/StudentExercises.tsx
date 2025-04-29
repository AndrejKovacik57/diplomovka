import React, {useEffect} from "react";
import axiosClient from "../axios-client.tsx";


const StudentExercises: React.FC = () => {
    useEffect(() => {
        axiosClient.get('/user/getExercises')
            .then(({data}) => {
                console.log(data)
            })
            .catch(error => {
                console.log(error.response);
            });
    }); // Dependency on token to conditionally run logic

    return (
        <div></div>
    )
}
export default StudentExercises;