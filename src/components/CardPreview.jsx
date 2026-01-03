import React from 'react';

// Color palettes
const COLORS = [
    { border: '#ef4444', bg: '#fef2f2', text: '#991b1b' }, // Red
    { border: '#3b82f6', bg: '#eff6ff', text: '#1e40af' }, // Blue
    { border: '#10b981', bg: '#ecfdf5', text: '#065f46' }, // Green
    { border: '#f59e0b', bg: '#fffbeb', text: '#92400e' }, // Amber
    { border: '#8b5cf6', bg: '#f5f3ff', text: '#5b21b6' }, // Purple
];

const CardPreview = ({
    studentName = "",
    familyName = "",
    familyLanguage = "sinhala",
    grade = "",
    school = "",
    subject = "",
    image = null,
    phone = "",
    language = 'both',
    template = 'modern',
    colorMode = 'color',
    fontSizes = { family: 1.2, name: 1.5, subject: 2.5, details: 1.0 },
    optimizeEnglish = true,
    autoScale = true,
    subjectLanguage = 'sinhala',
    nameLanguage = 'sinhala',
    gradeLanguage = 'sinhala',
    schoolLanguage = 'sinhala',
    textAlign = { subject: 'center', grade: 'center', school: 'center' },
    textStyles = {},
    scale = 1
}) => {
    const isBw = colorMode === 'bw';
    const safeTextStyles = textStyles || {};

    // --- Styles ---
    const fontStyle = {
        fontFamily: '"FM-Emanee", "Noto Sans Sinhala", "Abhaya Libre", sans-serif'
    };

    const containerStyle = {
        width: `${370 * scale}px`,
        height: `${240 * scale}px`,
        fontSize: `${16 * scale}px`,
        filter: isBw ? 'grayscale(100%)' : 'none',
        border: '1px solid #ddd',
        ...fontStyle
    };

    /**
     * Helper to render text with mixed fonts.
     */
    const renderMixedText = (text, specificLang) => {
        if (!text) return null;
        if (specificLang === 'english') {
            return <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{text}</span>;
        }
        if (!optimizeEnglish) return text;

        const parts = text.split(/([A-Za-z0-9\.\-\_\(\)\s]+)/g);

        return (
            <>
                {parts.map((part, index) => {
                    if (!part) return null;
                    if (/[A-Za-z0-9]/.test(part)) {
                        return (
                            <span key={index} style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>
                                {part}
                            </span>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    /**
     * Smart Sizing / Auto Scale Logic
     */
    const getSmartSize = (text, type) => {
        const len = text?.length || 0;
        let baseSize = 0;

        // 1. Determine Base Size (Manual or Auto Default)
        // If Auto-Scale is ON, we ignore user sliders and use ideal defaults.
        // If OFF, we use user sliders.
        if (autoScale) {
            switch (type) {
                case 'family': baseSize = 1.2; break;
                case 'name': baseSize = 1.8; break; // Slightly larger default for impact
                case 'subject': baseSize = 2.4; break;
                case 'grade': baseSize = 1.2; break;
                case 'phone': baseSize = 1.0; break;
                case 'school': baseSize = 1.0; break;
                default: baseSize = 1.0;
            }
        } else {
            baseSize = fontSizes[type] || 1.0;
        }

        // 2. Apply Length-Based Reduction (Aggressive)
        // We reduce the size progressively as text gets longer
        let multiplier = 1.0;

        if (type === 'name') {
            if (len > 35) multiplier = 0.55;
            else if (len > 25) multiplier = 0.65;
            else if (len > 18) multiplier = 0.8;
            else if (len > 12) multiplier = 0.9;
        } else if (type === 'subject') {
            if (len > 12) multiplier = 0.6; // Subjects shouldn't be too long usually
            else if (len > 8) multiplier = 0.8;
        } else if (type === 'school') {
            if (len > 30) multiplier = 0.75; // Long school names
            else if (len > 20) multiplier = 0.9;
        }

        // Only apply multiplier if Auto-Scale is ON
        if (!autoScale) multiplier = 1.0;

        return `${baseSize * multiplier}em`;
    };

    // Render Subject
    const renderSubjectContent = (color = 'black', subjectLanguage = 'sinhala') => {
        if (!subject || subject.trim() === '') return <div className="h-6"></div>; // Reduced height placeholder
        const fontSize = getSmartSize(subject, 'subject');

        const align = textAlign?.subject || 'center';
        const alignClass = align === 'left' ? 'text-left' : (align === 'right' ? 'text-right' : 'text-center');

        // Apply font based on subject language preference
        const subjectText = subjectLanguage === 'english'
            ? <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{subject}</span>
            : (subjectLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{subject}</span> : renderMixedText(subject));

        return (
            <span className={`leading-none break-words w-full inline-block px-1`}
                style={{
                    fontSize,
                    color,
                    lineHeight: '1.0',
                    textAlign: align,
                    fontWeight: safeTextStyles.subject?.bold ? 'bold' : 'normal',
                    fontStyle: safeTextStyles.subject?.italic ? 'italic' : 'normal'
                }}>
                {subjectText}
            </span>
        );
    };

    // Helper for Details (Grade + Phone)
    const renderDetailsGroup = (color = 'black') => {
        const baseGradeSize = getSmartSize(grade, 'grade');
        const gradeSize = parseFloat(baseGradeSize) * 1.1 + 'em';
        const phoneSize = getSmartSize(phone, 'phone');
        const phoneSizeVal = parseFloat(phoneSize) * 0.85 + 'em';

        const align = textAlign?.grade || 'center';
        const flexAlign = align === 'left' ? 'items-start' : (align === 'right' ? 'items-end' : 'items-center');
        const textAlignClass = align === 'left' ? 'text-left' : (align === 'right' ? 'text-right' : 'text-center');

        // Grade prefix removed

        const alignItems = align === 'left' ? 'flex-start' : (align === 'right' ? 'flex-end' : 'center');

        return (
            <div className={`flex flex-col justify-center w-full font-bold px-1`} style={{ alignItems }}>
                {grade && (
                    <div className="leading-tight mb-1" style={{
                        fontSize: gradeSize, color, textAlign: align,
                        fontWeight: safeTextStyles.grade?.bold ? 'bold' : 'normal',
                        fontStyle: safeTextStyles.grade?.italic ? 'italic' : 'normal'
                    }}>
                        {gradeLanguage === 'english' ?
                            <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{grade}</span> :
                            (gradeLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{grade}</span> : renderMixedText(grade, gradeLanguage))
                        }
                    </div>
                )}
                {phone && (
                    <div className="leading-tight text-opacity-80" style={{ fontSize: phoneSizeVal, color, textAlign: align }}>
                        {renderMixedText(phone)}
                    </div>
                )}
            </div>
        );
    };

    // Helper for School
    const renderSchool = (color = 'black') => {
        if (!school) return null;
        const fontSize = getSmartSize(school, 'school');

        const align = textAlign?.school || 'center';
        const alignClass = align === 'left' ? 'text-left' : (align === 'right' ? 'text-right' : 'text-center');

        return (
            <div className={alignClass} style={{
                fontSize, color,
                fontWeight: safeTextStyles.school?.bold ? 'bold' : 'normal',
                fontStyle: safeTextStyles.school?.italic ? 'italic' : 'normal'
            }}>
                {schoolLanguage === 'english' ?
                    <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{school}</span> :
                    (schoolLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{school}</span> : renderMixedText(school, schoolLanguage))
                }
            </div>
        );
    };

    // Render Full Name Block (Family Name + Student Name)
    const renderNameBlock = (color = 'black') => {
        // Calculate optimized size for family name
        const familySizeVal = getSmartSize(familyName, 'family');
        // Calculate optimized size for student name
        const nameSizeVal = getSmartSize(studentName, 'name');

        return (
            <div className="w-full text-center px-1 leading-tight pb-0">
                {familyName && <div className="leading-none mb-0.5" style={{
                    fontSize: familySizeVal, color, marginTop: '2px',
                    fontWeight: safeTextStyles.family?.bold ? 'bold' : 'normal',
                    fontStyle: safeTextStyles.family?.italic ? 'italic' : 'normal'
                }}>
                    {familyLanguage === 'english' ?
                        <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{familyName}</span> :
                        (familyLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{familyName}</span> : renderMixedText(familyName))
                    }
                </div>}
                <span className="break-words" style={{
                    fontSize: nameSizeVal, color,
                    fontWeight: safeTextStyles.name?.bold ? 'bold' : 'bold', // Default name is bold usually
                    fontStyle: safeTextStyles.name?.italic ? 'italic' : 'normal'
                }}>
                    {nameLanguage === 'english' ?
                        <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{studentName}</span> :
                        (nameLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{studentName}</span> : renderMixedText(studentName))
                    }
                </span>
            </div>
        );
    };

    const colorIdx = (subject?.length || 0) % COLORS.length;
    const theme = COLORS[colorIdx];

    // ===================================
    // MINIMAL
    // ===================================
    if (template === 'minimal') {
        const borderColor = isBw ? '#000' : theme.text;
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-black"
                style={{ ...containerStyle, border: `1px solid #ccc` }}
            >
                <div style={{ border: `${8 * scale}px solid ${borderColor}` }} className="absolute inset-0 z-0"></div>

                <div className="absolute inset-0 flex flex-col p-[4%] z-10 justify-center items-center h-full" style={{ gap: `${4 * scale}px` }}>
                    <div className="w-full text-center border-b-2 pb-2" style={{ borderColor }}>
                        {renderNameBlock('black')}
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center w-full">
                        {renderSubjectContent('black', subjectLanguage)}
                        <div className="mt-2 text-center">
                            {renderDetailsGroup('black')}
                        </div>
                    </div>

                    {image && (
                        <div className="absolute top-2 right-2 w-[50px] h-[50px] opacity-20 pointer-events-none">
                            <img src={image} className="w-full h-full object-contain grayscale" />
                        </div>
                    )}

                    <div className="w-full text-center pt-2 border-t-2" style={{ borderColor }}>
                        {renderSchool('gray')}
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // BRUSH
    // ===================================
    if (template === 'brush') {
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-black"
                style={{ ...containerStyle, border: `1px solid #ddd` }}
            >
                {/* Brush Stroke Border SVG simulation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="98%" height="96%" fill="none" stroke={isBw ? 'black' : theme.text} strokeWidth="5" strokeDasharray="20,10" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 flex w-full h-full p-[3%]">
                    <div className="flex-1 flex flex-col items-center justify-center z-10" style={{ gap: `${4 * scale}px` }}>
                        <div className="bg-white px-4 pt-1">
                            {renderNameBlock('black')}
                        </div>

                        <div className="flex-1 flex flex-row items-center w-full mt-1">
                            <div className="flex-1 flex flex-col items-center">
                                {renderSubjectContent(isBw ? 'black' : theme.text, subjectLanguage)}
                                <div className="mt-2">{renderDetailsGroup('black')}</div>
                            </div>
                            {image && (
                                <div className="w-[30%] flex justify-center">
                                    <img src={image} className="max-h-[80px] object-contain" style={{ filter: 'sepia(0.5)' }} />
                                </div>
                            )}
                        </div>

                        <div className="bg-white px-4 pb-1 mt-1 border-t border-dashed border-gray-300 w-[80%] text-center">
                            {renderSchool('gray')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // COMIC
    // ===================================
    if (template === 'comic') {
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-black font-sans"
                style={{ ...containerStyle, border: `2px solid #000`, boxShadow: '5px 5px 0px rgba(0,0,0,1)' }}
            >
                {/* Dots Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

                <div className="relative z-10 flex flex-col w-full h-full p-2">
                    <div className="w-full bg-white border-2 border-black rounded-xl p-2 shadow-[3px_3px_0px_#000] mb-2 text-center">
                        {renderNameBlock('black')}
                    </div>

                    <div className="flex-1 flex flex-row items-center">
                        <div className="flex-1 flex flex-col items-center justify-center bg-yellow-50 border-2 border-black rounded-full p-4 h-[120px] w-[120px] shadow-[3px_3px_0px_#000] mx-auto relative overflow-visible">
                            <div className="absolute -top-3 bg-white border border-black px-2 text-xs font-bold -rotate-6">SUBJECT</div>
                            {renderSubjectContent('black', subjectLanguage)}
                            <div className="absolute -bottom-4 bg-white border border-black px-2 py-1 rounded shadow-[2px_2px_0px_#000] text-xs w-max max-w-[150%] z-20">
                                {renderDetailsGroup('black')}
                            </div>
                        </div>
                    </div>

                    {image && (
                        <div className="absolute bottom-2 right-2 w-[80px] h-[80px] bg-white border-2 border-black rounded-lg p-1 shadow-[3px_3px_0px_#000] z-0 -rotate-3">
                            <img src={image} className="w-full h-full object-contain" />
                        </div>
                    )}

                    <div className="mt-auto pt-4 text-center font-bold bg-white w-max mx-auto px-2 relative z-10">
                        {renderSchool('black')}
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // CLASSIC
    // ===================================
    if (template === 'classic') {
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-black"
                style={{ ...containerStyle, border: `1px solid #ccc`, padding: `${4 * scale}px` }}
            >
                <div className="absolute inset-0 border-2 border-black pointer-events-none" style={{ margin: `${4 * scale}px` }}></div>

                <div className="flex w-full h-full relative z-10">
                    <div className="flex-1 flex flex-col items-center justify-center py-[1%] z-20 overflow-hidden px-1" style={{ gap: `${4 * scale}px` }}>
                        {/* Top: Name Block */}
                        {renderNameBlock('black')}

                        {/* Middle: Subject + Details Group */}
                        <div className="flex-1 flex flex-col justify-center items-center w-full px-2 -my-2">{/* Negative vertical margin to pull content together */}
                            {renderSubjectContent('black', subjectLanguage)}
                            <div className="mt-0.5">{renderDetailsGroup('black')}</div>
                        </div>

                        {/* Bottom: School */}
                        <div className="w-full flex items-end justify-center mb-0.5">
                            {renderSchool('black')}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="w-[30%] flex-shrink-0 flex items-end justify-center relative -mr-2 -mb-2">
                        {image && <img src={image} className="object-contain max-h-[95%] w-full mb-1" />}
                    </div>
                </div>
            </div>
        );
    }


    // ===================================
    // RETRO
    // ===================================
    if (template === 'retro') {
        return (
            <div
                className="bg-amber-50 relative flex overflow-hidden box-border text-black"
                style={{ ...containerStyle, border: `${1 * scale}px solid #ccc`, borderRadius: `${2 * scale}px` }}
            >
                <div className="absolute inset-0 border-[6px] border-double border-[#5c4033] pointer-events-none" style={{ borderWidth: `${6 * scale}px` }}></div>

                <div className="absolute top-0 left-0 w-8 h-8 border-r border-b border-[#5c4033] bg-white transform rotate-45 -translate-x-4 -translate-y-4 z-0"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-[#5c4033] bg-white transform -rotate-45 translate-x-4 -translate-y-4 z-0"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-r border-t border-[#5c4033] bg-white transform -rotate-45 -translate-x-4 translate-y-4 z-0"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-l border-t border-[#5c4033] bg-white transform rotate-45 translate-x-4 translate-y-4 z-0"></div>

                <div className="flex w-full h-full p-2 relative z-10 flex-col">
                    <div className="w-full flex justify-center text-center items-center pt-1 px-4">
                        <div className="text-[#3e2723]">
                            {renderNameBlock('#3e2723')}
                        </div>
                    </div>

                    <div className="my-0.5 w-full border-t border-b border-[#8d6e63] py-1 bg-white/50 flex-1 flex flex-col justify-center items-center" style={{ gap: `${4 * scale}px` }}>
                        {renderSubjectContent('#3e2723', subjectLanguage)}
                        <div className="mt-0.5">{renderDetailsGroup('#5d4037')}</div>
                    </div>

                    <div className="mt-auto pb-0.5 w-full border-t border-dotted border-[#8d6e63] text-center px-4">
                        {renderSchool('#5d4037')}
                    </div>

                    {image && (
                        <div className="absolute right-1 bottom-1 w-[25%] h-[50%] flex items-end justify-end pointer-events-none opacity-80 mix-blend-multiply">
                            <img src={image} className="object-contain max-h-full max-w-full" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ===================================
    // SKETCHY
    // ===================================
    if (template === 'sketchy') {
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-black"
                style={{ ...containerStyle, border: `1px solid #ccc`, padding: `${3 * scale}px` }}
            >
                <div className="absolute inset-0 border-2 border-black pointer-events-none" style={{ margin: `${4 * scale}px` }}></div>

                <svg className="absolute top-0 left-0 text-black z-0 pointer-events-none" width={100 * scale} height={100 * scale} viewBox="0 0 100 100">
                    <path d="M-10,10 Q20,5 40,-10" stroke="black" strokeWidth={4 * scale} fill="none" />
                    <path d="M0,0 L30,0 L0,30 Z" fill="black" />
                </svg>
                <svg className="absolute bottom-0 right-0 text-black z-0 pointer-events-none rotate-180" width={100 * scale} height={100 * scale} viewBox="0 0 100 100">
                    <path d="M0,0 L30,0 L0,30 Z" fill="black" />
                    <path d="M-10,10 Q20,5 40,-10" stroke="black" strokeWidth={4 * scale} fill="none" />
                </svg>

                <div className="flex w-full h-full relative z-10 pt-[2%] px-[4%]">
                    <div className="w-[65%] flex flex-col h-full z-20 justify-center pb-1 overflow-hidden pl-2" style={{ gap: `${4 * scale}px` }}>
                        <div className="flex justify-center items-end w-full">
                            {renderNameBlock('black')}
                        </div>

                        <div className="flex flex-col justify-center items-center w-full">
                            {renderSubjectContent('black', subjectLanguage)}
                            <div className="mt-1 w-full">{renderDetailsGroup('black')}</div>
                        </div>

                        <div className="flex flex-col items-center w-full">
                            {renderSchool('black')}
                        </div>
                    </div>

                    <div className="w-[35%] h-full flex items-end justify-center relative -ml-2 pb-1">
                        {image && (
                            <div className="relative w-full h-full flex items-end justify-center">
                                <img
                                    src={image}
                                    className="object-contain max-h-[90%] max-w-[140%] transform translate-x-2"
                                    style={{
                                        maskImage: 'linear-gradient(to top, black 80%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%)'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // FLORAL
    // ===================================
    if (template === 'floral') {
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border text-gray-800"
                style={{ ...containerStyle, border: `1px solid #ccc`, outline: `${1 * scale}px solid #555`, outlineOffset: `${-6 * scale}px` }}
            >
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-gray-600 rounded-tl-3xl"></div>
                    <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-gray-600 rounded-tr-3xl"></div>
                    <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-gray-600 rounded-bl-3xl"></div>
                    <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-gray-600 rounded-br-3xl"></div>
                </div>

                <div className="flex-1 flex flex-col p-[3%] z-10 items-center justify-center" style={{ gap: `${4 * scale}px` }}>
                    <div className="w-full text-center border-b border-gray-300 pb-1">
                        <div className="font-serif italic leading-none break-words">
                            {renderNameBlock('black')}
                        </div>
                    </div>

                    <div className="py-1 text-center w-full relative flex-1 flex flex-col justify-center">
                        {image && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><img src={image} className="h-full object-contain grayscale" /></div>}
                        {renderSubjectContent('black', subjectLanguage)}
                        <div className="mt-1">{renderDetailsGroup('black')}</div>
                    </div>

                    <div className="w-full text-center border-t border-gray-300 pt-1 pb-0.5">
                        {renderSchool('black')}
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // BOLD
    // ===================================
    if (template === 'bold') {
        const mainColor = isBw ? '#222' : theme.bg;
        const borderColor = isBw ? '#000' : theme.border;
        return (
            <div
                className="bg-white relative flex overflow-hidden box-border font-sans shadow-lg"
                style={{ ...containerStyle, border: `1px solid #ddd` }}
            >
                <div className="absolute inset-0 pointer-events-none z-0"
                    style={{ border: `${4 * scale}px solid ${borderColor}`, borderRadius: `${8 * scale}px` }} />

                <div className="flex w-full h-full z-10">
                    <div className="w-[30%] flex flex-col items-center justify-center p-2 text-center border-r-2 z-10 ml-1 my-1"
                        style={{ backgroundColor: mainColor, borderColor: borderColor }}>
                        {image ? (
                            <div className="w-full h-full p-1"><img src={image} className="w-full h-full object-cover rounded-lg" /></div>
                        ) : (
                            <div className="w-[60px] h-[60px] bg-white/20 rounded-full mb-2" />
                        )}
                    </div>

                    <div className="flex-1 flex flex-col p-3 justify-center bg-white w-full overflow-hidden z-10 my-1 mr-1" style={{ gap: `${4 * scale}px` }}>
                        <div className="text-gray-800 border-b-2 border-gray-100 pb-1 text-center leading-none break-words">
                            {renderNameBlock('black')}
                        </div>

                        <div className="text-center w-full flex-1 flex flex-col justify-center">
                            {renderSubjectContent(isBw ? '#000' : theme.text, subjectLanguage)}
                            <div className="mt-1">{renderDetailsGroup('gray')}</div>
                        </div>

                        <div className="text-center pt-1">
                            {renderSchool('gray')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // PATTERN
    // ===================================
    if (template === 'pattern') {
        return (
            <div
                className="relative overflow-hidden box-border shadow-md bg-white"
                style={{ ...containerStyle, border: `1px solid #ddd` }}
            >
                <div className="absolute inset-0 pointer-events-none z-0"
                    style={{ border: `${4 * scale}px solid ${isBw ? 'black' : '#0ea5e9'}`, borderRadius: `${12 * scale}px` }} />

                <div className="absolute inset-0 flex flex-col p-[4%] z-10 w-full h-full">
                    <div className="flex-shrink-0 flex items-center justify-between border-b-2 border-blue-100 pb-1 w-full">
                        <div className="flex-1 w-full overflow-hidden text-center">
                            <div className="text-gray-800 leading-none break-words">
                                {renderNameBlock(isBw ? 'black' : '#1f2937')}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-row items-center justify-between relative w-full overflow-hidden">
                        <div className="text-left w-[60%] flex flex-col justify-center h-full">
                            {renderSubjectContent(isBw ? 'black' : '#0284c7', subjectLanguage)}
                            <div className="mt-1 text-left w-full pl-2">
                                {renderDetailsGroup('gray')}
                            </div>
                        </div>
                        <div className="w-[35%] h-full flex items-center justify-center">
                            {image ? <img src={image} className="w-full h-full object-contain" /> : null}
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-center bg-white/90 p-1 rounded-lg backdrop-blur-sm mt-auto w-full mb-1 border border-gray-100 shadow-sm">
                        {renderSchool('#4b5563')}
                    </div>
                </div>
            </div>
        );
    }

    // ===================================
    // MODERN (Default)
    // ===================================
    return (
        <div
            className="relative overflow-hidden box-border bg-white"
            style={{ ...containerStyle, boxShadow: `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px`, border: '1px solid #eee' }}
        >
            <div className="absolute left-0 top-0 bottom-0 z-0" style={{ width: `${12 * scale}px`, backgroundColor: isBw ? '#333' : theme.border }}></div>

            <div className="h-full flex flex-row ml-[12px]">
                <div className="flex-1 flex flex-col p-[3%] justify-center w-full overflow-hidden" style={{ gap: `${4 * scale}px` }}>
                    <div className="mb-0">
                        <div className="text-gray-800 leading-tight break-words">
                            {renderNameBlock(isBw ? 'black' : '#1f2937')}
                        </div>
                    </div>

                    <div className={`my-1 w-full relative z-10 flex flex-col justify-center ${textAlign?.subject === 'center' ? 'items-center' : (textAlign?.subject === 'right' ? 'items-end' : 'items-start')}`}>
                        {renderSubjectContent(isBw ? '#000' : theme.text, subjectLanguage)}
                        {/* Grade and Phone grouped under subject */}
                        <div className={`mt-1 pl-1 w-full ${textAlign?.grade === 'center' ? 'text-center' : (textAlign?.grade === 'right' ? 'text-right' : 'text-left')}`}>
                            {grade && <div className="text-gray-700" style={{
                                fontSize: `${fontSizes.grade}em`,
                                fontWeight: safeTextStyles.grade?.bold ? 'bold' : 'bold', // Default was bold
                                fontStyle: safeTextStyles.grade?.italic ? 'italic' : 'normal'
                            }}>
                                {gradeLanguage === 'english' ?
                                    <span style={{ fontFamily: '"Abhaya Libre", "Times New Roman", serif' }}>{grade}</span> :
                                    (gradeLanguage === 'sinhala' ? <span style={{ fontFamily: '"FM-Emanee", sans-serif' }}>{grade}</span> : renderMixedText(grade, gradeLanguage))
                                }
                            </div>}
                            {phone && <div className="font-medium text-gray-500" style={{ fontSize: `${fontSizes.phone}em` }}>{renderMixedText(phone)}</div>}
                        </div>
                    </div>

                    {school && (
                        <div className="flex justify-between items-end border-t border-gray-100 pt-1 pb-1 z-10 relative mt-auto">
                            <div className={`w-full ${textAlign?.school === 'center' ? 'text-center' : (textAlign?.school === 'left' ? 'text-left' : 'text-right')}`}>
                                {renderSchool('gray')}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-[100px] bg-gray-50 flex items-center justify-center p-1 overflow-hidden relative" style={{ backgroundColor: isBw ? '#f9f9f9' : theme.bg }}>
                    {image && <img src={image} className="w-full h-full object-contain" />}
                </div>
            </div>
        </div>
    );
};

export default CardPreview;
