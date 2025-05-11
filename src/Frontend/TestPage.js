// src/Frontend/TestPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const TestPage = () => {
    const { id } = useParams();

    return (
        <div style={{ padding: '500px', textAlign: 'center' }}>
            <h1>Test Page</h1>
            <p style={{ fontSize: '20px' }}>
                ID from URL: <strong>{id}</strong>
            </p>
        </div>
    );
};

export default TestPage;