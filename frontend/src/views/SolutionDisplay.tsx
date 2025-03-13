import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";

const ExerciseDisplay: React.FC = () => {
    const [solutions, setSolutions] = useState<{ id: number; file_name: string;}[]>([]);
    const [selectedolutionId, setSelectedSolutionId] = useState<number | null>(null);
    const [output, setOutput] = useState<string | null>(null);

    useEffect(() => {axiosClient.get('/solution',)
        .then(({data}) => {
            console.log(data);
            setSolutions(data);
        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
            }
        })
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(selectedolutionId);
        axiosClient.get(`/test/${selectedolutionId}`,)
        .then(({data}) => {
            console.log("halo");
            console.log(data);

            setOutput(data.output);
        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
            }
        })

    };

    return (
        <div className="exercise-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exercise">Select an Solution:</label>
                    <select
                        id="exercise"
                        className="form-control"
                        onChange={(e) => setSelectedSolutionId(Number(e.target.value))}
                        required
                    >
                        <option value="">-- Select --</option>
                        {solutions.map((solution) => (
                            <option key={solution.id} value={solution.id}>{solution.id +" - "+ solution.file_name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <button className="btn">Submit</button>
                </div>
                {output && (
                    <div className="output-result">
                        <strong>Output:</strong> {output}
                    </div>
                )}
            </form>

        </div>
    );
};

export default ExerciseDisplay;
