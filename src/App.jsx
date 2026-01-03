import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NameCardTool from './pages/NameCardTool';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="name-card-generator" element={<NameCardTool />} />
                    <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
