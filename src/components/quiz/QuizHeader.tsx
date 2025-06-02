import ProgressBar from "./ProgressBar";



const QuizHeader: React.FC<{
  currentQuestionIndex: number;
  totalQuestions: number;
}> = ({ currentQuestionIndex, totalQuestions }) => {
    return (
        <div className="border-b w-full flex items-center justify-between px-4 h-20 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <button onClick={() => alert("Close quiz")} className="text-2xl font-bold hover:text-gray-600">&times;</button>
                <div className="max-w-4xl items-center mx-auto px-4">
                    <ProgressBar
                        currentQuestionIndex={currentQuestionIndex-1}
                        totalQuestions={totalQuestions}
                    />
                </div>
                <div className="w-8"></div> {/* Spacer for visual balance */}
            </div>
    )
}

export default QuizHeader;