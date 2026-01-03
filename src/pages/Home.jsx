import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, ArrowRight, Printer, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <div className="w-full bg-blue-600 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl font-bold font-sans tracking-tight">
                        Tools for Sri Lankan Schools
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        A collection of simple, effective tools to help teachers, parents, and students.
                        Start creating beautiful printables today.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/name-card-generator"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg"
                        >
                            <PenTool size={20} />
                            Try Name Card Generator
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16 w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
                    <Star className="text-yellow-500 fill-current" />
                    Featured Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Tool Card 1: Name Card Generator */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            {/* Abstract decorative circles */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-50 rounded-full opacity-50"></div>

                            <PenTool size={48} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Name Card Generator</h3>
                            <p className="text-gray-500 mb-4 h-20">
                                Create and print custom name tags for school books. Supports Sinhala & English with auto-scaling text.
                            </p>
                            <Link
                                to="/name-card-generator"
                                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                            >
                                Open Tool <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Placeholder Card for Future Tools */}
                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center h-full min-h-[350px]">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Printer size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-1">More Coming Soon...</h3>
                        <p className="text-sm text-gray-400">
                            We are working on adding more tools like Timetable Generators and Exam Paper styling.
                        </p>
                    </div>

                </div>
            </div>

            {/* Features Section */}
            <div className="w-full bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Printer />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Printer Friendly</h3>
                        <p className="text-gray-500">Optimized for A4 paper sizes with proper margins.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <PenTool />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Customizable</h3>
                        <p className="text-gray-500">Edit colors, fonts, and styles instantly.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Download />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Free Downloads</h3>
                        <p className="text-gray-500">Export as PDF, Word, or individual images.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
