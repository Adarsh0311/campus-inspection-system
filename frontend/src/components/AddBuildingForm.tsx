import React, { useState } from 'react';

interface AddBuildingFormProps {
    onSave: (name: string, location: string) => void;
    onCancel: () => void;
}

const AddBuildingForm = ({ onSave, onCancel }: AddBuildingFormProps) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(name, location); // Pass the data up to the parent component
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="buildingName" className="form-label">Building Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="buildingName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="buildingLocation" className="form-label">Location (Optional)</label>
                <input
                    type="text"
                    className="form-control"
                    id="buildingLocation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Save Building
                </button>
            </div>
        </form>
    );
};

export default AddBuildingForm;