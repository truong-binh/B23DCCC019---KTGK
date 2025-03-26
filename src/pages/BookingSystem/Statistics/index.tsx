import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, DatePicker, Table } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { Column } from '@ant-design/plots';

const { RangePicker } = DatePicker;

const Statistics: React.FC = () => {
	const { appointments, services, staff } = useModel('bookingSystem');
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
		moment().startOf('month'),
		moment().endOf('month'),
	]);
	const [statistics, setStatistics] = useState<any>({
		totalAppointments: 0,
		totalRevenue: 0,
		serviceStats: [],
		staffStats: [],
	});

	useEffect(() => {
		calculateStatistics();
	}, [dateRange, appointments]);

	const calculateStatistics = () => {
		const [startDate, endDate] = dateRange;
		const filteredAppointments = appointments.filter(
			(appointment) =>
				moment(appointment.date).isBetween(startDate, endDate, 'day', '[]') && appointment.status === 'completed',
		);

		// Tổng số lịch hẹn và doanh thu
		const totalAppointments = filteredAppointments.length;
		const totalRevenue = filteredAppointments.reduce((sum, appointment) => {
			const service = services.find((s) => s.id === appointment.serviceId);
			return sum + (service?.price || 0);
		}, 0);

		// Thống kê theo dịch vụ
		const serviceStats = services.map((service) => {
			const serviceAppointments = filteredAppointments.filter((a) => a.serviceId === service.id);
			return {
				serviceName: service.name,
				count: serviceAppointments.length,
				revenue: serviceAppointments.length * service.price,
			};
		});

		// Thống kê theo nhân viên
		const staffStats = staff.map((staffMember) => {
			const staffAppointments = filteredAppointments.filter((a) => a.staffId === staffMember.id);
			const revenue = staffAppointments.reduce((sum, appointment) => {
				const service = services.find((s) => s.id === appointment.serviceId);
				return sum + (service?.price || 0);
			}, 0);

			return {
				staffName: staffMember.name,
				count: staffAppointments.length,
				revenue,
			};
		});

		setStatistics({
			totalAppointments,
			totalRevenue,
			serviceStats,
			staffStats,
		});
	};

	const serviceColumns = [
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceName',
			key: 'serviceName',
		},
		{
			title: 'Số lượt sử dụng',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => b.count - a.count,
		},
		{
			title: 'Doanh thu',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (value: number) => value.toLocaleString('vi-VN') + ' VNĐ',
			sorter: (a: any, b: any) => b.revenue - a.revenue,
		},
	];

	const staffColumns = [
		{
			title: 'Nhân viên',
			dataIndex: 'staffName',
			key: 'staffName',
		},
		{
			title: 'Số lịch hẹn',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => b.count - a.count,
		},
		{
			title: 'Doanh thu',
			dataIndex: 'revenue',
			key: 'revenue',
			render: (value: number) => value.toLocaleString('vi-VN') + ' VNĐ',
			sorter: (a: any, b: any) => b.revenue - a.revenue,
		},
	];

	return (
		<PageContainer>
			<Card>
				<Row gutter={16} style={{ marginBottom: 24 }}>
					<Col span={24}>
						<RangePicker
							value={dateRange}
							onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
							style={{ marginBottom: 16 }}
						/>
					</Col>
					<Col span={12}>
						<Statistic title='Tổng số lịch hẹn' value={statistics.totalAppointments} suffix='lịch hẹn' />
					</Col>
					<Col span={12}>
						<Statistic
							title='Tổng doanh thu'
							value={statistics.totalRevenue}
							suffix='VNĐ'
							formatter={(value) => value.toLocaleString('vi-VN')}
						/>
					</Col>
				</Row>

				<Card title='Thống kê theo dịch vụ' style={{ marginBottom: 24 }}>
					<Table columns={serviceColumns} dataSource={statistics.serviceStats} rowKey='serviceName' />
					<Column
						height={300}
						data={statistics.serviceStats}
						xField='serviceName'
						yField='revenue'
						label={{
							position: 'middle',
							style: {
								fill: '#FFFFFF',
								opacity: 0.6,
							},
						}}
					/>
				</Card>

				<Card title='Thống kê theo nhân viên'>
					<Table columns={staffColumns} dataSource={statistics.staffStats} rowKey='staffName' />
					<Column
						height={300}
						data={statistics.staffStats}
						xField='staffName'
						yField='revenue'
						label={{
							position: 'middle',
							style: {
								fill: '#FFFFFF',
								opacity: 0.6,
							},
						}}
					/>
				</Card>
			</Card>
		</PageContainer>
	);
};

export default Statistics;
