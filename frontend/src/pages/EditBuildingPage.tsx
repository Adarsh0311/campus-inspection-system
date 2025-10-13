import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import buildingService from '../services/buildingService';

// Define the types for our data, matching the backend schema
//
type ChecklistItemType = 'NUMERIC' | 'BOOLEAN' | 'TEXT';

interface ChecklistItem {
    id?: string; // Existing items from the DB will have an ID
    question: string;
    type: ChecklistItemType;
}

const EditBuildingPage = () => {
    // --- Hooks for navigation and getting URL parameters ---
    const { id } = useParams<{ id: string }>(); // Gets the ':id' from the URL
    const navigate = useNavigate();

    // --- State for the form inputs ---
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

    // --- State for the "add new item" sub-form ---
    const [newQuestion, setNewQuestion] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<ChecklistItemType>('BOOLEAN');

    // --- State to hold the original checklist for comparison on save ---
    const [originalChecklist, setOriginalChecklist] = useState<ChecklistItem[]>([]);

    // --- State for loading and error messages ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Data Fetching Effect ---
    // This useEffect runs once when the component loads to fetch the building data.
    useEffect(() => {
        if (!id) {
            setError('No building ID provided.');
            setIsLoading(false);
            return;
        }

        const fetchBuildingData = async () => {
            try {
                const response = await buildingService.getBuildingById(id);
                const { name, location, checklistItems } = response.data;

                // Populate the form with data from the API
                setName(name);
                setLocation(location || '');
                setChecklistItems(checklistItems);
                setOriginalChecklist(checklistItems); // Save a copy for later comparison

            } catch (err) {
                setError('Failed to fetch building data. It may not exist or you may not be authorized.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuildingData();
    }, [id]); // The [id] dependency means this effect will re-run if the URL ID changes

    // --- Event Handlers for Checklist Management ---
    const handleAddItem = () => {
        if (!newQuestion.trim()) return;
        const newItem: ChecklistItem = { question: newQuestion, type: newQuestionType };
        setChecklistItems([...checklistItems, newItem]); // Add new item to the end of the list
        setNewQuestion(''); // Clear the input
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setChecklistItems(checklistItems.filter((_, index) => index !== indexToRemove));
    };

    // --- Main Save Handler ---
    const handleSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!id) return;

        // Logic to calculate the differences between the original and current checklist
        const originalIds = new Set(originalChecklist.map(item => item.id));
        const currentIds = new Set(checklistItems.map(item => item.id).filter(Boolean));

        const payload = {
            name,
            location,
            checklistItems: {
                // Items that are in the current list but don't have an ID are new
                create: checklistItems.filter(item => !item.id),
                // Items that existed in the original list and still exist in the current list
                update: checklistItems.filter(item => item.id && originalIds.has(item.id)),
                // IDs from the original list that are no longer in the current list
                delete: originalChecklist.filter(item => item.id && !currentIds.has(item.id)).map(item => item.id!),
            }
        };

        try {
            await buildingService.updateBuilding(id, payload);
            navigate('/buildings'); // Go back to the list on success
        } catch (error) {
            console.error("Failed to update building", error);
            setError("Failed to save changes. Please try again.");
        }
    };

    // --- Render Logic ---
    if (isLoading) return <p>Loading...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2>Edit Building</h2>
            <form onSubmit={handleSaveChanges} className="card p-4">
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

                <h4>Inspection Checklist</h4>
                <ul className="list-group mb-3">
                    {checklistItems.map((item, index) => (
                        <li key={item.id || `new-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{item.question} <span className="badge bg-secondary">{item.type}</span></span>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(index)}>Remove</button>
                        </li>
                    ))}
                    {checklistItems.length === 0 && <li className="list-group-item text-muted">No checklist items yet.</li>}
                </ul>

                <div className="card bg-light p-3">
                    <h5>Add New Item</h5>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label htmlFor="newQuestion" className="form-label">Question</label>
                            <input type="text" className="form-control" id="newQuestion" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="newQuestionType" className="form-label">Type</label>
                            <select id="newQuestionType" className="form-select" value={newQuestionType} onChange={e => setNewQuestionType(e.target.value as ChecklistItemType)}>
                                <option value="BOOLEAN">Yes/No</option>
                                <option value="NUMERIC">Number</option>
                                <option value="TEXT">Text</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="button" className="btn btn-secondary w-100" onClick={handleAddItem}>Add</button>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => navigate('/buildings')}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditBuildingPage;