import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buildingService from '../services/buildingService';

// Define the type for a single checklist item in our local state
type ChecklistItem = {
    question: string;
    type: 'NUMERIC' | 'BOOLEAN' | 'TEXT';
};

const AddBuildingPage = () => {
    const navigate = useNavigate();
    // --- React Concept: State Management ---
    // State for the main building details
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    // State for the list of checklist items the user has added so far
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

    // State for the form used to add a *new* checklist item
    const [newQuestion, setNewQuestion] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<'NUMERIC' | 'BOOLEAN' | 'TEXT'>('BOOLEAN');

    // --- Event Handlers ---
    const handleAddItem = () => {
        if (!newQuestion.trim()) return; // Don't add empty questions
        const newItem: ChecklistItem = { question: newQuestion, type: newQuestionType };
        setChecklistItems([...checklistItems, newItem]); // Add the new item to the list
        setNewQuestion(''); // Clear the input for the next item
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setChecklistItems(checklistItems.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveBuilding = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await buildingService.createBuildingWithChecklist({
                name,
                location,
                checklistItems,
            });
            navigate('/buildings'); // Redirect to the building list on success
        } catch (error) {
            console.error('Failed to save building', error);
            alert('Failed to save building. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add New Building</h2>
            <form onSubmit={handleSaveBuilding} className="card p-4">
                {/* Section 1: Building Details */}
                <h4>Building Details</h4>
                <div className="mb-3">
                    <label htmlFor="buildingName" className="form-label">Building Name</label>
                    <input type="text" className="form-control" id="buildingName" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="buildingLocation" className="form-label">Location</label>
                    <input type="text" className="form-control" id="buildingLocation" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <hr />

                {/* Section 2: Checklist Items */}
                <h4>Inspection Checklist</h4>
                {/* Display the list of added items */}
                <ul className="list-group mb-3">
                    {checklistItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{item.question} <span className="badge bg-secondary">{item.type}</span></span>
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>Remove</button>
                        </li>
                    ))}
                </ul>

                {/* Form to add a new item */}
                <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                        <label htmlFor="newQuestion" className="form-label">New Question</label>
                        <input type="text" className="form-control" id="newQuestion" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="newQuestionType" className="form-label">Type</label>
                        <select id="newQuestionType" className="form-select" value={newQuestionType} onChange={e => setNewQuestionType(e.target.value as any)}>
                            <option value="BOOLEAN">Yes/No</option>
                            <option value="NUMERIC">Number</option>
                            <option value="TEXT">Text</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={handleAddItem}>Add Item</button>
                    </div>
                </div>
                <hr />

                {/* Final Save Button */}
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => navigate('/buildings')}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Building</button>
                </div>
            </form>
        </div>
    );
};

export default AddBuildingPage;