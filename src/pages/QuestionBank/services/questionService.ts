export interface Question {
	id: string;
	code: string;
	subjectId: string;
	content: string;
	difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
	knowledgeBlock: string;
}

const questionService = {
	getAll: (): Question[] => {
		return JSON.parse(localStorage.getItem('questions') || '[]');
	},

	getBySubject: (subjectId: string): Question[] => {
		const questions = questionService.getAll();
		return questions.filter((q) => q.subjectId === subjectId);
	},

	add: (question: Question) => {
		const questions = questionService.getAll();
		questions.push(question);
		localStorage.setItem('questions', JSON.stringify(questions));
	},

	update: (question: Question) => {
		const questions = questionService.getAll();
		const index = questions.findIndex((q) => q.id === question.id);
		if (index !== -1) {
			questions[index] = question;
			localStorage.setItem('questions', JSON.stringify(questions));
		}
	},

	delete: (id: string) => {
		const questions = questionService.getAll();
		const newQuestions = questions.filter((q) => q.id !== id);
		localStorage.setItem('questions', JSON.stringify(newQuestions));
	},
};

export default questionService;
