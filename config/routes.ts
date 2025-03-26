export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/todo-list',
	// 	name: 'TodoList',
	// 	icon: 'OrderedListOutlined',
	// 	component: './TodoList',
	// },
	// {
	// 	path: '/games',
	// 	name: 'Đoán số',
	// 	icon: 'NumberOutlined',
	// 	component: './GuessNumberGame',
	// },
	// {
	// 	path: '/study-manager',
	// 	name: 'Quản lý học tập',
	// 	icon: 'BookOutlined',
	// 	component: './StudyManager',
	// },
	// {
	// 	path: '/rock-paper-scissors',
	// 	name: 'Oẳn Tù Tì',
	// 	icon: 'ThunderboltOutlined',
	// 	component: './RockPaperScissors',
	// },
	// {
	// 	path: '/question-bank',
	// 	name: 'Ngân hàng câu hỏi',
	// 	icon: 'BookOutlined',
	// 	routes: [
	// 		{
	// 			path: 'subjects',
	// 			name: 'Quản lý môn học',
	// 			component: './QuestionBank/Subjects',
	// 			icon: 'ReadOutlined',
	// 		},
	// 		{
	// 			path: 'questions',
	// 			name: 'Quản lý câu hỏi',
	// 			component: './QuestionBank/Questions',
	// 			icon: 'FormOutlined',
	// 		},
	// 		{
	// 			path: 'exams',
	// 			name: 'Quản lý đề thi',
	// 			component: './QuestionBank/Exams',
	// 			icon: 'FileTextOutlined',
	// 		},
	// 	],
	// },
	// {
	// 	path: '/booking-system',
	// 	name: 'Quản lý đặt lịch',
	// 	icon: 'CalendarOutlined',
	// 	routes: [
	// 		{
	// 			path: 'appointments',
	// 			name: 'Quản lý lịch hẹn',
	// 			component: './BookingSystem/Appointments',
	// 			icon: 'ScheduleOutlined',
	// 		},
	// 		{
	// 			path: 'staff',
	// 			name: 'Quản lý nhân viên',
	// 			component: './BookingSystem/Staff',
	// 			icon: 'TeamOutlined',
	// 		},
	// 		{
	// 			path: 'services',
	// 			name: 'Quản lý dịch vụ',
	// 			component: './BookingSystem/Services',
	// 			icon: 'ShopOutlined',
	// 		},
	// 		{
	// 			path: 'reviews',
	// 			name: 'Đánh giá',
	// 			component: './BookingSystem/Reviews',
	// 			icon: 'StarOutlined',
	// 		},
	// 		{
	// 			path: 'statistics',
	// 			name: 'Thống kê',
	// 			component: './BookingSystem/Statistics',
	// 			icon: 'BarChartOutlined',
	// 		},
	// 	],
	// },
	{
		path: '/courses',
		name: 'Quản lý khóa học',
		icon: 'BookOutlined',
		component: './courses',
	  },


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
