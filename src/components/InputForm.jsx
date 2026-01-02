import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

const InputForm = ({ onUpdate, data }) => {
    const [newSubject, setNewSubject] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...data, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate({ ...data, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const addSubject = () => {
        if (!newSubject.trim()) return;
        const item = { name: newSubject, count: parseInt(quantity) || 1, id: Date.now() };
        onUpdate({
            ...data,
            subjects: [...(data.subjects || []), item]
        });
        setNewSubject('');
        setQuantity(1);
    };

    const removeSubject = (id) => {
        onUpdate({
            ...data,
            subjects: (data.subjects || []).filter(s => s.id !== id)
        });
    };

    return (
        <div className="space-y-6">

            {/* Customization Options */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language Style</label>
                    <div className="flex gap-2">
                        {['english', 'sinhala', 'both'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => onUpdate({ ...data, language: lang })}
                                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${data.language === lang
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    {/* Toggle for Mixed Font */}
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            id="optimizeEnglish"
                            checked={data.optimizeEnglish !== false} // Default true
                            onChange={(e) => onUpdate({ ...data, optimizeEnglish: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="optimizeEnglish" className="ml-2 block text-xs text-gray-600 font-medium cursor-pointer">
                            Smart English Font (Use Serif for English letters)
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Template</label>
                    <div className="flex gap-2 flex-wrap">
                        {['sketchy', 'modern', 'pattern', 'floral', 'bold', 'classic', 'retro', 'minimal', 'brush', 'comic'].map((tmpl) => (
                            <button
                                key={tmpl}
                                onClick={() => onUpdate({ ...data, template: tmpl })}
                                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${data.template === tmpl
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {tmpl}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Mode</label>
                    <div className="flex gap-2 rounded-md bg-gray-200 p-1 w-fit">
                        <button
                            onClick={() => onUpdate({ ...data, colorMode: 'color' })}
                            className={`px-4 py-1.5 text-sm rounded-md transition-all ${data.colorMode === 'color' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-500'
                                }`}
                        >
                            Color
                        </button>
                        <button
                            onClick={() => onUpdate({ ...data, colorMode: 'bw' })}
                            className={`px-4 py-1.5 text-sm rounded-md transition-all ${data.colorMode === 'bw' ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-500'
                                }`}
                        >
                            B&W
                        </button>
                    </div>
                </div>
            </div>

            {/* Font Size Customization */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Font Sizes</h3>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="autoScale"
                            checked={data.autoScale !== false}
                            onChange={(e) => onUpdate({ ...data, autoScale: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoScale" className="ml-2 text-xs text-gray-600 font-medium cursor-pointer">
                            Auto-Adjust (Recommended)
                        </label>
                    </div>
                </div>

                <div className={`grid grid-cols-1 gap-4 transition-opacity ${data.autoScale ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Family Name Size</span>
                            <span>{data.fontSizes?.family || 1.2}em</span>
                        </div>
                        <input
                            type="range" min="0.8" max="2.5" step="0.1"
                            value={data.fontSizes?.family || 1.2}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, family: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Name Size</span>
                            <span>{data.fontSizes?.name || 1.5}em</span>
                        </div>
                        <input
                            type="range" min="0.8" max="3.0" step="0.1"
                            value={data.fontSizes?.name || 1.5}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, name: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Subject Size</span>
                            <span>{data.fontSizes?.subject || 2.5}em</span>
                        </div>
                        <input
                            type="range" min="1.0" max="4.0" step="0.1"
                            value={data.fontSizes?.subject || 2.5}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, subject: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Grade Size</span>
                            <span>{data.fontSizes?.grade || 1.2}em</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2.5" step="0.1"
                            value={data.fontSizes?.grade || 1.2}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, grade: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Phone Size</span>
                            <span>{data.fontSizes?.phone || 1.0}em</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2.0" step="0.1"
                            value={data.fontSizes?.phone || 1.0}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, phone: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>School Size</span>
                            <span>{data.fontSizes?.school || 1.0}em</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2.5" step="0.1"
                            value={data.fontSizes?.school || 1.0}
                            onChange={(e) => onUpdate({ ...data, fontSizes: { ...data.fontSizes, school: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Main Details */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            name="familyName"
                            value={data.familyName || ''}
                            onChange={handleInputChange}
                            placeholder="Family Name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                        />
                        <div className="flex bg-gray-100 p-1 rounded-md">
                            <button
                                onClick={() => onUpdate({ ...data, familyLanguage: 'sinhala' })}
                                className={`px-3 py-1 text-xs font-medium rounded ${data.familyLanguage === 'sinhala' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Sinhala
                            </button>
                            <button
                                onClick={() => onUpdate({ ...data, familyLanguage: 'english' })}
                                className={`px-3 py-1 text-xs font-medium rounded ${data.familyLanguage === 'english' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                        type="text"
                        name="studentName"
                        value={data.studentName || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. D.P.L. Seyansa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <input
                            type="text"
                            name="grade"
                            value={data.grade || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Grade 2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                        <input
                            type="text"
                            name="school"
                            value={data.school || ''}
                            onChange={handleInputChange}
                            placeholder="School Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                        type="text"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. 077-1234567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Photo / Image</label>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 flex-1">
                            <Upload size={18} className="mr-2" />
                            <span className="text-sm text-gray-600">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {data.image && (
                            <div className="w-10 h-10 rounded overflow-hidden border">
                                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Subject Management */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Subjects</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Subject Name (e.g. Mathematics)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala"
                        onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addSubject}
                        title="Add Subject"
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Helper for blank cards */}
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => {
                            const item = { name: "", count: parseInt(quantity) || 1, id: Date.now() };
                            onUpdate({ ...data, subjects: [...(data.subjects || []), item] });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                        + Add Blank / Handwriting Card
                    </button>
                </div>

                {/* List of subjects */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {(!data.subjects || data.subjects.length === 0) && (
                        <p className="text-sm text-gray-400 text-center italic">No subjects added yet.</p>
                    )}
                    {data.subjects?.map((subj) => (
                        <div key={subj.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                            <span className={`font-sinhala font-medium ${!subj.name ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                                {subj.name || "(Handwriting Card)"}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold bg-gray-200 px-2 py-0.5 rounded text-gray-600">x{subj.count}</span>
                                <button onClick={() => removeSubject(subj.id)} className="text-red-400 hover:text-red-600">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InputForm;
