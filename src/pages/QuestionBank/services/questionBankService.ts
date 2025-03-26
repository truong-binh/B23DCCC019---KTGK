// Định nghĩa các interface
interface Subject {
	id: string;
	code: string;
	name: string;
	credits: number;
	knowledgeBlocks: string[];
}

interface Question {
	id: string;
	code: string;
	subjectId: string;
	content: string;
	difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
	knowledgeBlock: string;
}

interface Exam {
	id: string;
	name: string;
	subjectId: string;
	questions: string[];
	structure: {
		difficulty: string;
		knowledgeBlock: string;
		count: number;
	}[];
	createdAt: string;
}

// Service cho môn học
const subjectService = {
	getAll: (): Subject[] => {
		return JSON.parse(localStorage.getItem('subjects') || '[]');
	},

	add: (subject: Subject) => {
		const subjects = subjectService.getAll();
		subjects.push(subject);
		localStorage.setItem('subjects', JSON.stringify(subjects));
	},

	update: (subject: Subject) => {
		const subjects = subjectService.getAll();
		const index = subjects.findIndex((s) => s.id === subject.id);
		if (index !== -1) {
			subjects[index] = subject;
			localStorage.setItem('subjects', JSON.stringify(subjects));
		}
	},

	delete: (id: string) => {
		const subjects = subjectService.getAll();
		const newSubjects = subjects.filter((s) => s.id !== id);
		localStorage.setItem('subjects', JSON.stringify(newSubjects));
	},
};

// Service cho câu hỏi
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

// Service cho đề thi
const examService = {
	getAll: (): Exam[] => {
		return JSON.parse(localStorage.getItem('exams') || '[]');
	},

	add: (exam: Exam) => {
		const exams = examService.getAll();
		exams.push(exam);
		localStorage.setItem('exams', JSON.stringify(exams));
	},

	delete: (id: string) => {
		const exams = examService.getAll();
		const newExams = exams.filter((e) => e.id !== id);
		localStorage.setItem('exams', JSON.stringify(newExams));
	},

	// Hàm tạo đề thi theo cấu trúc
	generateExam: (subjectId: string, structure: any[]): string[] => {
		const availableQuestions = questionService.getBySubject(subjectId);
		const selectedQuestions: string[] = [];

		structure.forEach((req) => {
			const matchingQuestions = availableQuestions.filter(
				(q) =>
					q.difficulty === req.difficulty &&
					q.knowledgeBlock === req.knowledgeBlock &&
					!selectedQuestions.includes(q.id),
			);

			if (matchingQuestions.length < req.count) {
				throw new Error(`Không đủ câu hỏi cho mức độ ${req.difficulty} và khối kiến thức ${req.knowledgeBlock}`);
			}

			// Chọn ngẫu nhiên câu hỏi
			for (let i = 0; i < req.count; i++) {
				const randomIndex = Math.floor(Math.random() * matchingQuestions.length);
				selectedQuestions.push(matchingQuestions[randomIndex].id);
				matchingQuestions.splice(randomIndex, 1);
			}
		});

		return selectedQuestions;
	},
};

export { subjectService, questionService, examService };
