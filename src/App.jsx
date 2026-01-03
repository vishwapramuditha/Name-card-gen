import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, ImageRun } from 'docx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Loader2, FileImage, FileText } from 'lucide-react';
import InputForm from './components/InputForm';
import CardPreview from './components/CardPreview';

function App() {
    const [data, setData] = useState({
        studentName: '',
        familyName: '',
        grade: '',
        gradeLetter: '', // English letter suffix
        school: '',
        subjects: [],
        image: null,
        phone: '',
        language: 'sinhala', // 'english', 'sinhala', 'both'
        template: 'sketchy', // 'sketchy', 'modern', 'pattern'
        colorMode: 'color', // 'color', 'bw'
        fontSizes: { family: 1.2, name: 1.5, subject: 2.5, grade: 1.2, phone: 1.0, school: 1.0 },
        optimizeEnglish: true,
        familyLanguage: 'sinhala',
        nameLanguage: 'sinhala',
        gradeLanguage: 'sinhala',
        schoolLanguage: 'sinhala',
        textAlign: { subject: 'center', grade: 'center', school: 'center' },
        autoScale: true,
        textStyles: {
            name: { bold: false, italic: false, color: '#000000' },
            family: { bold: false, italic: false, color: '#000000' },
            grade: { bold: false, italic: false, color: '#000000' },
            school: { bold: false, italic: false, color: '#000000' },
            subject: { bold: false, italic: false, color: '#000000' },
            phone: { bold: false, italic: false, color: '#000000' }
        }
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const printRef = useRef(null);

    // Flatten the subjects based on quantity
    const getAllCards = () => {
        const cards = [];
        if (!data.subjects) return cards;

        data.subjects.forEach(subj => {
            for (let i = 0; i < subj.count; i++) {
                cards.push({
                    ...data,
                    ...subj, // Apply snapshot details (studentName, grade, etc.)
                    subject: subj.name, // Ensure subject name is correct
                    language: subj.language || data.language || 'sinhala', // prefer subject snapshot lang, then global
                    textStyles: subj.textStyles || data.textStyles, // Snapshot styles or global
                    uniqueId: `${subj.id}-${i}`
                });
            }
        });
        return cards;
    };

    const handleDownloadPdf = async () => {
        const cards = getAllCards();
        if (cards.length === 0) {
            alert("Please add at least one subject.");
            return;
        }

        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 100)); // Allow render

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        // We assume the print container holds "pages" of cards
        // To keep it simple, we'll capture each "A4 page" div from the DOM
        const pageElements = printRef.current.querySelectorAll('.print-page');

        for (let i = 0; i < pageElements.length; i++) {
            const canvas = await html2canvas(pageElements[i], {
                scale: 3, // High resolution for print (approx 300dpi)
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            // Use JPEG with 0.85 quality to balance size and clarity (PNG is too huge)
            const imgData = canvas.toDataURL('image/jpeg', 0.85);

            if (i > 0) pdf.addPage();
            // Adjust width/height to fit A4 exactly
            pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }

        pdf.save(`${data.studentName || 'School'}_Name_Cards.pdf`);
        setIsGenerating(false);
    };

    const handleDownloadWord = async () => {
        const cards = getAllCards();
        if (cards.length === 0) {
            alert("Please add at least one subject.");
            return;
        }
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 100));

        const pageElements = printRef.current.querySelectorAll('.print-page');
        const children = [];

        for (let i = 0; i < pageElements.length; i++) {
            const canvas = await html2canvas(pageElements[i], {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.85);

            const imageRun = new ImageRun({
                data: imgData,
                transformation: {
                    width: 794,
                    height: 1123,
                },
            });

            children.push(new Paragraph({
                children: [imageRun],
            }));
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: children,
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${data.studentName || 'School'}_Name_Cards.docx`);
        setIsGenerating(false);
    };

    const handleDownloadImages = async () => {
        const cards = getAllCards();
        if (cards.length === 0) {
            alert("Please add at least one subject.");
            return;
        }
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 100));

        const cardElements = printRef.current.querySelectorAll('.print-card-item > div');
        const zip = new JSZip();

        const usedNames = new Set();

        for (let i = 0; i < cardElements.length; i++) {
            const canvas = await html2canvas(cardElements[i], {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const subject = cards[i]?.subject || `card_${i + 1}`;
            let filename = `${subject}.png`;
            let counter = 1;
            while (usedNames.has(filename)) {
                filename = `${subject}_${counter}.png`;
                counter++;
            }
            usedNames.add(filename);

            const imgData = canvas.toDataURL('image/png').split(',')[1];
            zip.file(filename, imgData, { base64: true });
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${data.studentName || 'School'}_Cards_Images.zip`);
        setIsGenerating(false);
    };

    const allCards = getAllCards();

    // Pagination logic for Print View
    const cardsPerPage = 8; // 2 cols x 4 rows fits well on A4 with spacing
    const pages = [];
    for (let i = 0; i < allCards.length; i += cardsPerPage) {
        pages.push(allCards.slice(i, i + cardsPerPage));
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 font-sinhala">School Name Card Generator</h1>
                    <p className="text-gray-500">Create and print custom book labels for school</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Input Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span>Details & Subjects</span>
                            </h2>
                            <InputForm data={data} onUpdate={setData} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGenerating || allCards.length === 0}
                                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all shadow
                                ${isGenerating || allCards.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'}`}
                            >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                PDF
                            </button>
                            <button
                                onClick={handleDownloadWord}
                                disabled={isGenerating || allCards.length === 0}
                                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all shadow
                                ${isGenerating || allCards.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-700 text-white hover:bg-blue-800'}`}
                            >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                                Word
                            </button>
                        </div>
                        <button
                            onClick={handleDownloadImages}
                            disabled={isGenerating || allCards.length === 0}
                            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all shadow
                            ${isGenerating || allCards.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileImage size={18} />}
                            Download Images (ZIP)
                        </button>

                        <div className="text-center text-sm text-gray-500">
                            <p>Total Cards: {allCards.length}</p>
                            <p>Pages: {pages.length}</p>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Live Preview</h2>
                            <div className="flex flex-col items-center gap-8">
                                {/* Just show one card as a sample */}
                                <div className="transform scale-100 sm:scale-110 origin-top transition-all">
                                    <CardPreview
                                        studentName={data.studentName}
                                        familyName={data.familyName}
                                        familyLanguage={data.familyLanguage}
                                        grade={data.grade}
                                        gradeLetter={data.gradeLetter}
                                        autoScale={data.autoScale}
                                        school={data.school}
                                        subject={data.subjects.length > 0 ? data.subjects[data.subjects.length - 1].name : ""}
                                        image={data.image}
                                        phone={data.phone}
                                        language={data.language}
                                        fontSizes={data.fontSizes}
                                        optimizeEnglish={data.optimizeEnglish}
                                        template={data.template}
                                        colorMode={data.colorMode}
                                        subjectLanguage={data.subjects.length > 0 ? (data.subjects[data.subjects.length - 1].language || 'sinhala') : 'sinhala'}
                                        textAlign={data.textAlign}
                                        nameLanguage={data.nameLanguage}
                                        gradeLanguage={data.gradeLanguage}
                                        schoolLanguage={data.schoolLanguage}
                                        // familyLanguage is already passed above
                                        // Pass text styles
                                        textStyles={data.textStyles}
                                        scale={1.2}
                                    />
                                </div>

                                <div className="text-sm text-gray-400 max-w-sm text-center">
                                    This is a preview of how a single card looks. The PDF will contain {allCards.length} cards arranged on A4 pages.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Hidden Print Area - This is what gets captured */}
            <div className="fixed" style={{ left: '-10000px', top: 0, width: '210mm' }}>
                <div ref={printRef}>
                    {pages.map((pageCards, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="print-page bg-white grid grid-cols-2 content-start gap-4 p-4"
                            style={{
                                width: '210mm',
                                height: '297mm', // A4 Height
                                boxSizing: 'border-box'
                            }}
                        >
                            {pageCards.map((card, idx) => (
                                <div key={`${pageIndex}-${idx}`} className="flex justify-center">
                                    <CardPreview
                                        studentName={card.studentName}
                                        familyName={card.familyName}
                                        familyLanguage={card.familyLanguage}
                                        grade={card.grade}
                                        gradeLetter={card.gradeLetter}
                                        autoScale={card.autoScale}
                                        school={card.school}
                                        subject={card.subject}
                                        image={card.image}
                                        phone={card.phone}
                                        language={card.language}
                                        fontSizes={card.fontSizes}
                                        optimizeEnglish={card.optimizeEnglish}
                                        template={card.template}
                                        colorMode={card.colorMode}
                                        subjectLanguage={card.language || 'sinhala'}
                                        textAlign={card.textAlign}
                                        nameLanguage={card.nameLanguage}
                                        gradeLanguage={card.gradeLanguage}
                                        schoolLanguage={card.schoolLanguage}
                                        textStyles={card.textStyles}
                                        scale={1.0} // exact size for print
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default App;
