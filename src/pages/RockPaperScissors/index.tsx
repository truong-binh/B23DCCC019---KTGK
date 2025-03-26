import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Typography, Row, Col, List, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Title, Text } = Typography;
const CHOICES = ['✌️ Kéo', '✊ Búa', '✋ Bao'];

const RockPaperScissors: React.FC = () => {
	const [history, setHistory] = useState<
		Array<{
			player: string;
			computer: string;
			result: string;
			time: Date;
		}>
	>([]);

	const play = (playerChoice: number) => {
		const computerChoice = Math.floor(Math.random() * 3);

		let result = 'Hòa';
		if ((playerChoice + 1) % 3 === computerChoice) {
			result = 'Thua';
		} else if ((computerChoice + 1) % 3 === playerChoice) {
			result = 'Thắng';
		}

		setHistory([
			{
				player: CHOICES[playerChoice],
				computer: CHOICES[computerChoice],
				result,
				time: new Date(),
			},
			...history,
		]);
	};

	const clearHistory = () => {
		setHistory([]);
	};

	return (
		<PageContainer>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={16}>
					<Card>
						<Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
							Oẳn Tù Tì
						</Title>

						<Row justify='center' gutter={[16, 16]}>
							{CHOICES.map((choice, index) => (
								<Col key={choice}>
									<Button size='large' onClick={() => play(index)} style={{ height: 80, width: 120, fontSize: 20 }}>
										{choice}
									</Button>
								</Col>
							))}
						</Row>
					</Card>
				</Col>

				<Col xs={24} md={8}>
					<Card>
						<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
							<Title level={3} style={{ margin: 0 }}>
								Lịch sử đấu
							</Title>
							<Button
								type='primary'
								danger
								icon={<DeleteOutlined />}
								onClick={clearHistory}
								disabled={history.length === 0}
							>
								Xóa lịch sử
							</Button>
						</Space>

						<List
							dataSource={history}
							locale={{ emptyText: 'Chưa có lượt chơi nào' }}
							renderItem={(game) => (
								<List.Item>
									<Space direction='vertical' style={{ width: '100%' }}>
										<Text>
											{game.player} vs {game.computer} -{' '}
											<Text
												strong
												style={{
													color: game.result === 'Thắng' ? '#52c41a' : game.result === 'Thua' ? '#f5222d' : '#faad14',
												}}
											>
												{game.result}
											</Text>
										</Text>
										<Text type='secondary' style={{ fontSize: '12px' }}>
											{game.time.toLocaleString()}
										</Text>
									</Space>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>
		</PageContainer>
	);
};

export default RockPaperScissors;
