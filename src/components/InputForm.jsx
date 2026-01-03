import React, { useState } from 'react';
import { Plus, X, Upload, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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
        const item = {
            name: newSubject,
            count: parseInt(quantity) || 1,
            id: Date.now(),
            // Snapshot details
            studentName: data.studentName,
            familyName: data.familyName,
            grade: data.grade,
            school: data.school,
            phone: data.phone,
            language: data.language,
            familyLanguage: data.familyLanguage,
            nameLanguage: data.nameLanguage,
            gradeLanguage: data.gradeLanguage,
            schoolLanguage: data.schoolLanguage,
            textAlign: data.textAlign,
            optimizeEnglish: data.optimizeEnglish,
            textStyles: data.textStyles || {}, // Snapshot text styles
        };
        onUpdate({
            ...data,
            // Keep the snapshots in subjects
            subjects: [...(data.subjects || []), item],
            // We KEEP School, Grade, Phone, Image AND Name persisting for batch entry per user request
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

            {/* Text Alignment Panel */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Text Alignment</h3>
                <div className="grid grid-cols-3 gap-2">
                    {['subject', 'grade', 'school'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1 capitalize">{field}</span>
                            <div className="flex bg-gray-100 rounded p-0.5 border border-gray-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        type="button"
                                        key={align}
                                        onClick={() => onUpdate({
                                            ...data,
                                            textAlign: { ...data.textAlign, [field]: align }
                                        })}
                                        title={`Align ${align}`}
                                        className={`flex-1 p-1 flex justify-center rounded transition-all ${(data.textAlign?.[field] || 'center') === align
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {align === 'left' && <AlignLeft size={14} />}
                                        {align === 'center' && <AlignCenter size={14} />}
                                        {align === 'right' && <AlignRight size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Text Styling Panel */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Text Styling</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {['name', 'family', 'subject', 'grade', 'school'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1 capitalize">{field}</span>
                            <div className="flex bg-gray-100 rounded p-1 border border-gray-200 gap-1 justify-center">
                                <button
                                    type="button"
                                    onClick={() => onUpdate({
                                        ...data,
                                        textStyles: {
                                            ...data.textStyles,
                                            [field]: { ...(data.textStyles?.[field] || {}), bold: !data.textStyles?.[field]?.bold }
                                        }
                                    })}
                                    className={`p-1.5 rounded transition-colors ${data.textStyles?.[field]?.bold ? 'bg-white text-black shadow font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="Bold"
                                >
                                    B
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onUpdate({
                                        ...data,
                                        textStyles: {
                                            ...data.textStyles,
                                            [field]: { ...(data.textStyles?.[field] || {}), italic: !data.textStyles?.[field]?.italic }
                                        }
                                    })}
                                    className={`p-1.5 rounded transition-colors ${data.textStyles?.[field]?.italic ? 'bg-white text-black shadow italic' : 'text-gray-400 hover:text-gray-600'}`}
                                    title="Italic"
                                >
                                    I
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">1</span>
                    Batch Settings (Fixed)
                </h3>
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
                        <div className="flex justify-end mt-1">
                            <div className="flex bg-gray-100 p-0.5 rounded text-xs">
                                <button
                                    onClick={() => onUpdate({ ...data, gradeLanguage: 'sinhala' })}
                                    className={`px-2 py-0.5 rounded ${data.gradeLanguage === 'sinhala' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >Sinhala</button>
                                <button
                                    onClick={() => onUpdate({ ...data, gradeLanguage: 'english' })}
                                    className={`px-2 py-0.5 rounded ${data.gradeLanguage === 'english' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >English</button>
                            </div>
                        </div>
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
                        <div className="flex justify-end mt-1">
                            <div className="flex bg-gray-100 p-0.5 rounded text-xs">
                                <button
                                    onClick={() => onUpdate({ ...data, schoolLanguage: 'sinhala' })}
                                    className={`px-2 py-0.5 rounded ${data.schoolLanguage === 'sinhala' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                >Sinhala</button>
                                <button
                                    onClick={() => onUpdate({ ...data, schoolLanguage: 'english' })}
                                    className={`px-2 py-0.5 rounded ${data.schoolLanguage === 'english' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                >English</button>
                            </div>
                        </div>
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

            {/* Student Details Section */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center">
                    <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">2</span>
                    New Student Card
                </h3>

                {/* Moved Student Name & Family Name Inputs */}
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Family Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                name="familyName"
                                value={data.familyName || ''}
                                onChange={handleInputChange}
                                placeholder="Family Name"
                                className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala bg-white"
                            />
                            <div className="flex bg-white p-1 rounded-md border border-gray-200">
                                <button
                                    onClick={() => onUpdate({ ...data, familyLanguage: 'sinhala' })}
                                    className={`px-3 py-1 text-xs font-medium rounded ${data.familyLanguage === 'sinhala' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Sinhala
                                </button>
                                <button
                                    onClick={() => onUpdate({ ...data, familyLanguage: 'english' })}
                                    className={`px-3 py-1 text-xs font-medium rounded ${data.familyLanguage === 'english' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                name="studentName"
                                value={data.studentName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. D.P.L. Seyansa"
                                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala bg-white"
                            />
                            <div className="flex justify-end">
                                <div className="flex bg-white p-0.5 rounded text-xs border border-gray-200">
                                    <button
                                        onClick={() => onUpdate({ ...data, nameLanguage: 'sinhala' })}
                                        className={`px-2 py-0.5 rounded ${data.nameLanguage === 'sinhala' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                    >Sinhala</button>
                                    <button
                                        onClick={() => onUpdate({ ...data, nameLanguage: 'english' })}
                                        className={`px-2 py-0.5 rounded ${data.nameLanguage === 'english' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                    >English</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Subject Management */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>

                <div className="flex justify-end mb-1">
                    <span className="text-xs text-gray-500 mr-2 self-center">Card Language:</span>
                    <div className="flex bg-gray-100 p-0.5 rounded text-xs">
                        <button
                            onClick={() => onUpdate({
                                ...data,
                                language: 'sinhala',
                                nameLanguage: 'sinhala',
                                gradeLanguage: 'sinhala',
                                schoolLanguage: 'sinhala',
                                familyLanguage: 'english' // User Request: Family name in English for Sinhala cards
                            })}
                            className={`px-2 py-0.5 rounded ${data.language === 'sinhala' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >Sinhala</button>
                        <button
                            onClick={() => onUpdate({
                                ...data,
                                language: 'english',
                                nameLanguage: 'english',
                                gradeLanguage: 'english',
                                schoolLanguage: 'english',
                                familyLanguage: 'english'
                            })}
                            className={`px-2 py-0.5 rounded ${data.language === 'english' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >English</button>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Subject Name (e.g. Mathematics)"
                        className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sinhala bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        title="Quantity"
                    />
                </div>

                <button
                    onClick={addSubject}
                    className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus size={20} />
                    Add Card to Batch
                </button>

                {/* Helper for blank cards */}
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => {
                            const item = {
                                name: "",
                                count: parseInt(quantity) || 1,
                                id: Date.now(),
                                // Snapshot details
                                studentName: data.studentName,
                                familyName: data.familyName,
                                grade: data.grade,
                                school: data.school,
                                phone: data.phone,
                                language: data.language,
                                familyLanguage: data.familyLanguage,
                                nameLanguage: data.nameLanguage,
                                gradeLanguage: data.gradeLanguage,
                                schoolLanguage: data.schoolLanguage,
                                textAlign: data.textAlign,
                                optimizeEnglish: data.optimizeEnglish
                            };
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
                        <div key={subj.id} className="bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                            <div className="flex items-center justify-between">
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
                            {/* Language selector */}
                            <div className="mt-2 flex gap-1 items-center">
                                <span className="text-xs text-gray-500">Font:</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = data.subjects.map(s => s.id === subj.id ? {
                                            ...s,
                                            language: 'sinhala',
                                            nameLanguage: 'sinhala',
                                            gradeLanguage: 'sinhala',
                                            schoolLanguage: 'sinhala',
                                            familyLanguage: 'english' // User Request: Family name in English
                                        } : s);
                                        onUpdate({ ...data, subjects: updated });
                                    }}
                                    className={`px-2 py-0.5 text-xs rounded transition-colors ${(subj.language || 'sinhala') === 'sinhala'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Sinhala
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = data.subjects.map(s => s.id === subj.id ? {
                                            ...s,
                                            language: 'english',
                                            nameLanguage: 'english',
                                            gradeLanguage: 'english',
                                            schoolLanguage: 'english',
                                            familyLanguage: 'english'
                                        } : s);
                                        onUpdate({ ...data, subjects: updated });
                                    }}
                                    className={`px-2 py-0.5 text-xs rounded transition-colors ${subj.language === 'english'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default InputForm;
