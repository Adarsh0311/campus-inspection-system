import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import buildingService from '../services/buildingService';




interface Building {
    id: string;
    name: string;
    location?: string;
}

const BuildingManagementPage = () => {
    const navigate = useNavigate();
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- React Concept: State for UI Control ---
    // This state will control whether the "Add Building" modal is visible.
    // const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await buildingService.getAllBuildings();
                setBuildings(response.data);
            } catch (err) {
                setError('Failed to fetch buildings.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBuildings();
    }, []);

    // Function to handle saving a new building
    // const handleSaveBuilding = async (name: string, location: string) => {
    //     try {
    //         const response = await buildingService.createBuilding(name, location);
    //         // --- React Concept: Updating State ---
    //         // To see the new building immediately, we add it to our existing
    //         // 'buildings' state array instead of refreshing the page.
    //         setBuildings([...buildings, response.data]);
    //         setIsModalOpen(false); // Close the modal on success
    //     } catch (err) {
    //         setError('Failed to create building.');
    //     }
    // };

    if (isLoading) return <p>Loading buildings...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Building Management</h2>
                <button className="btn btn-primary" onClick={() => navigate('/buildings/new')}>
                    + Add New Building
                </button>
            </div>

            {/* Building list table (same as before) */}
            <table className="table table-striped">
                {/* ... table head and body ... */}
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* --- React Concept: Rendering a List --- */}
                {/* We use the .map() function to turn our array of building data
              into an array of table row (<tr>) elements. */}
                {buildings.map((building) => (
                    <tr key={building.id}>
                        <td>{building.name}</td>
                        <td>{building.location || 'N/A'}</td>
                        <td>
                            <button className="btn btn-sm btn-secondary">Edit</button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>

            {/*// In the return statement, change the button*/}

        </div>
    );
};

export default BuildingManagementPage;