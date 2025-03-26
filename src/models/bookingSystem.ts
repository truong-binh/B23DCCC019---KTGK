import { useState, useEffect } from 'react';

export interface IService {
	id: string;
	name: string;
	price: number;
	duration: number; // Thời gian thực hiện (phút)
}

export interface IStaff {
	id: string;
	name: string;
	maxCustomersPerDay: number;
	workingHours: {
		dayOfWeek: number; // 0-6: Chủ nhật - Thứ 7
		startTime: string; // "09:00"
		endTime: string; // "17:00"
	}[];
	services: string[]; // ID của các dịch vụ
}

export interface IAppointment {
	id: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	serviceId: string;
	staffId: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:mm
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
	createdAt: string;
}

export interface IReview {
	id: string;
	appointmentId: string;
	rating: number; // 1-5
	comment: string;
	staffResponse?: string;
	createdAt: string;
}

export default () => {
	const [services, setServices] = useState<IService[]>([]);
	const [staff, setStaff] = useState<IStaff[]>([]);
	const [appointments, setAppointments] = useState<IAppointment[]>([]);
	const [reviews, setReviews] = useState<IReview[]>([]);

	// Load data from localStorage on mount
	useEffect(() => {
		const loadedServices = localStorage.getItem('booking-services');
		if (loadedServices) setServices(JSON.parse(loadedServices));

		const loadedStaff = localStorage.getItem('booking-staff');
		if (loadedStaff) setStaff(JSON.parse(loadedStaff));

		const loadedAppointments = localStorage.getItem('booking-appointments');
		if (loadedAppointments) setAppointments(JSON.parse(loadedAppointments));

		const loadedReviews = localStorage.getItem('booking-reviews');
		if (loadedReviews) setReviews(JSON.parse(loadedReviews));
	}, []);

	// Save to localStorage whenever data changes
	useEffect(() => {
		localStorage.setItem('booking-services', JSON.stringify(services));
	}, [services]);

	useEffect(() => {
		localStorage.setItem('booking-staff', JSON.stringify(staff));
	}, [staff]);

	useEffect(() => {
		localStorage.setItem('booking-appointments', JSON.stringify(appointments));
	}, [appointments]);

	useEffect(() => {
		localStorage.setItem('booking-reviews', JSON.stringify(reviews));
	}, [reviews]);

	return {
		services,
		setServices,
		staff,
		setStaff,
		appointments,
		setAppointments,
		reviews,
		setReviews,
	};
};
