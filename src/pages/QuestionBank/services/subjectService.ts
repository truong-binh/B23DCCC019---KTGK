export interface Subject {
	id: string;
	code: string;
	name: string;
	credits: number;
	knowledgeBlocks: string[];
}

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

export default subjectService;
