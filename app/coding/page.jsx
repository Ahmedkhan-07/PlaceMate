'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CodingRound() {
    const router = useRouter()
    const [problem, setProblem] = useState(null)
    const [language, setLanguage] = useState('python')
    const [difficulty, setDifficulty] = useState('medium')
    const [code, setCode] = useState('# Select a language and generate a problem to start')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [evaluation, setEvaluation] = useState(null)
    const [activeTab, setActiveTab] = useState('description')

    const languages = ['python', 'javascript', 'java', 'cpp', 'c']
    const difficulties = ['easy', 'medium', 'hard', 'dynamic']

    const generateProblem = async () => {
        try {
            setLoading(true)
            setEvaluation(null)

            const token = localStorage.getItem('placemate_token')
            const res = await fetch('/api/coding/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ difficulty, topic: 'random' })
            })

            const data = await res.json()
            if (!data.success) {
                toast.error(data.message || 'Failed to generate problem')
                return
            }

            setProblem(data.problem)
            const starter = data.problem.starterCode?.[language] || data.problem.starterCode?.python || ''
            setCode(starter)
            setActiveTab('description')
            toast.success('Problem generated!')

        } catch (error) {
            console.error(error)
            toast.error('Failed to generate problem')
        } finally {
            setLoading(false)
        }
    }

    const handleLanguageChange = (lang) => {
        setLanguage(lang)
        if (problem) {
            const starter = problem.starterCode?.[lang] || problem.starterCode?.python || ''
            setCode(starter)
            setEvaluation(null)
        }
    }

    const handleSubmit = async () => {
        if (!problem) { toast.error('Generate a problem first'); return }
        if (
            !code || code.trim() === '' ||
            code.includes('# Write your code here') ||
            code.includes('// Write your code here')
        ) {
            toast.error('Please write your solution first')
            return
        }
        try {
            setSubmitting(true)
            setEvaluation(null)
            setActiveTab('results')

            const token = localStorage.getItem('placemate_token')
            const res = await fetch('/api/coding/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code, language, problem, difficulty })
            })

            const data = await res.json()
            if (data.success) {
                setEvaluation(data.evaluation)
                if (data.evaluation.isCorrect) {
                    toast.success(`✅ Accepted! Score: ${data.evaluation.score}/100 🎉`)
                } else {
                    toast.error(`❌ ${data.evaluation.verdict} — Score: ${data.evaluation.score}/100`)
                }
            } else {
                toast.error(data.message || 'Evaluation failed')
            }
        } catch (error) {
            console.error(error)
            toast.error('Submission failed')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#F8F9FA] dark:bg-[#0F172A]">

            {/* Left Panel — Problem */}
            <div className="w-[45%] flex flex-col border-r border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">

                {/* Top Controls */}
                <div className="p-4 border-b border-border dark:border-gray-700 flex flex-wrap gap-2 items-center">
                    <div className="flex gap-1">
                        {difficulties.map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-200 ${difficulty === d
                                    ? d === 'easy' ? 'bg-green-500 text-white'
                                        : d === 'medium' ? 'bg-yellow-500 text-white'
                                            : d === 'hard' ? 'bg-red-500 text-white'
                                                : 'bg-gradient-to-r from-primary to-secondary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={generateProblem}
                        disabled={loading}
                        className="ml-auto px-4 py-1.5 rounded-md bg-primary text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? 'Generating...' : 'Generate Problem'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border dark:border-gray-700">
                    {['description', 'results'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-sm font-medium capitalize transition-all duration-200 ${activeTab === tab
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200'
                                }`}
                        >
                            {tab}
                            {tab === 'results' && evaluation && (
                                <span className={`ml-1.5 text-xs font-bold ${evaluation.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                    {evaluation.score}/100
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'description' && (
                        <>
                            {!problem ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="text-5xl mb-4">💻</div>
                                    <p className="text-text-primary dark:text-gray-200 font-semibold text-base mb-1">Ready to practice?</p>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm">Select a difficulty and click Generate Problem</p>
                                </div>
                            ) : (
                                <div className="space-y-5 p-6">
                                    {/* Header */}
                                    <div className="border-b border-border dark:border-gray-700 pb-4">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{problem.title}</h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>{problem.difficulty}</span>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{problem.topic}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <p className="text-text-primary dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
                                    </div>

                                    {/* Examples */}
                                    {problem.examples?.map((ex, i) => (
                                        <div key={i}>
                                            <p className="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wide mb-2">Example {i + 1}</p>
                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 font-mono text-sm space-y-1">
                                                <p className="text-text-primary dark:text-gray-200">
                                                    <span className="text-text-secondary dark:text-gray-400 font-sans font-medium">Input: </span>{ex.input}
                                                </p>
                                                <p className="text-text-primary dark:text-gray-200">
                                                    <span className="text-text-secondary dark:text-gray-400 font-sans font-medium">Output: </span>{ex.output}
                                                </p>
                                                {ex.explanation && (
                                                    <p className="text-text-secondary dark:text-gray-400 font-sans text-xs mt-2">{ex.explanation}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Constraints */}
                                    {problem.constraints?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-wide mb-2">Constraints</p>
                                            <ul className="space-y-1">
                                                {problem.constraints.map((c, i) => (
                                                    <li key={i} className="text-sm text-text-secondary dark:text-gray-400 flex gap-2">
                                                        <span className="text-primary">•</span>{c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'results' && (
                        <div className="p-5 space-y-4">
                            {!evaluation && !submitting ? (
                                <div className="text-center py-8">
                                    <div className="text-3xl mb-2">📝</div>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm">Write your solution and click Submit to get AI evaluation</p>
                                </div>
                            ) : submitting ? (
                                <div className="text-center py-8">
                                    <div className="text-3xl mb-3">⚙️</div>
                                    <p className="text-text-primary dark:text-gray-200 font-medium mb-1">Evaluating your solution...</p>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm">Groq AI is reviewing your code</p>
                                </div>
                            ) : evaluation && (
                                <>
                                    {/* Verdict */}
                                    <div className={`p-5 rounded-xl border-2 ${evaluation.isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{evaluation.isCorrect ? '✅' : '❌'}</span>
                                                <span className="font-bold text-lg text-text-primary dark:text-gray-100">{evaluation.verdict}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-bold text-primary">{evaluation.score}</span>
                                                <span className="text-text-secondary dark:text-gray-400 text-sm">/100</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-secondary dark:text-gray-300 leading-relaxed">{evaluation.summary}</p>
                                    </div>

                                    {/* Complexity */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                            <p className="text-xs font-semibold text-blue-500 mb-1">⏱ Time Complexity</p>
                                            <p className="font-bold text-blue-700 dark:text-blue-300 text-sm">{evaluation.timeComplexity}</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                                            <p className="text-xs font-semibold text-purple-500 mb-1">💾 Space Complexity</p>
                                            <p className="font-bold text-purple-700 dark:text-purple-300 text-sm">{evaluation.spaceComplexity}</p>
                                        </div>
                                    </div>

                                    {/* Syntax errors */}
                                    {evaluation.syntaxErrors && evaluation.syntaxErrors !== 'None' && (
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
                                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">🐛 Errors Found</p>
                                            <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">{evaluation.syntaxErrors}</p>
                                        </div>
                                    )}

                                    {/* Strengths */}
                                    {evaluation.strengths?.length > 0 && (
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                                            <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-2">💪 Strengths</p>
                                            <ul className="space-y-1">
                                                {evaluation.strengths.map((s, i) => (
                                                    <li key={i} className="text-sm text-green-700 dark:text-green-300 flex gap-2">
                                                        <span>✓</span>{s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Improvements */}
                                    {evaluation.improvements?.length > 0 && (
                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                                            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">🔧 Improvements</p>
                                            <ul className="space-y-1">
                                                {evaluation.improvements.map((imp, i) => (
                                                    <li key={i} className="text-sm text-orange-700 dark:text-orange-300 flex gap-2">
                                                        <span>→</span>{imp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Optimal approach */}
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                                        <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 mb-2">🏆 Optimal Approach</p>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">{evaluation.optimalApproach}</p>
                                    </div>

                                    {/* Optimal code */}
                                    {evaluation.optimalCode && (
                                        <div className="bg-gray-900 rounded-xl p-4">
                                            <p className="text-xs font-bold text-gray-400 mb-2">💡 Optimal Solution</p>
                                            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{evaluation.optimalCode}</pre>
                                        </div>
                                    )}

                                    {/* Try again */}
                                    <button
                                        onClick={() => { setEvaluation(null); setProblem(null); setActiveTab('description') }}
                                        className="w-full py-2.5 rounded-md bg-primary text-white font-semibold text-sm transition-all duration-200 hover:opacity-90"
                                    >
                                        Try Another Problem
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel — Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Editor Controls */}
                <div className="p-3 border-b border-border dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
                    <div className="flex gap-1">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${language === lang
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !problem}
                        className="ml-auto px-5 py-1.5 rounded-md bg-green-500 text-white text-sm font-semibold transition-all duration-200 hover:bg-green-600 disabled:opacity-60"
                    >
                        {submitting ? 'Evaluating...' : '✔ Submit'}
                    </button>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                    <MonacoEditor
                        height="100%"
                        language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            automaticLayout: true,
                            tabSize: 4,
                            padding: { top: 16 }
                        }}
                    />
                </div>

                {/* Footer — Exit */}
                <div className="border-t border-border dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-xs text-text-secondary dark:text-gray-400">PlaceMate Coding Round</span>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all duration-200 border border-red-300 dark:border-red-700"
                    >
                        ✕ Exit Coding Round
                    </button>
                </div>
            </div>
        </div>
    )
}
