import { Button, Input, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.less';

const { Title, Text } = Typography;

const GuessNumberGame: React.FC = () => {
  // State để lưu số ngẫu nhiên
  const [randomNumber, setRandomNumber] = useState<number>(0);
  // State để lưu số lần đoán còn lại
  const [guessesLeft, setGuessesLeft] = useState<number>(10);
  // State để lưu số người chơi đoán
  const [currentGuess, setCurrentGuess] = useState<string>('');
  // State để lưu thông báo
  const [feedback, setFeedback] = useState<string>('Hãy đoán một số từ 1 đến 100!');
  // State để kiểm tra game đã kết thúc chưa
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Hàm tạo số ngẫu nhiên khi bắt đầu game
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // Khởi tạo game
  const initializeGame = () => {
    setRandomNumber(generateRandomNumber());
    setGuessesLeft(10);
    setCurrentGuess('');
    setFeedback('Hãy đoán một số từ 1 đến 100!');
    setGameOver(false);
  };

  // Khởi tạo game lần đầu
  useEffect(() => {
    initializeGame();
  }, []);

  // Xử lý khi người chơi đoán
  const handleGuess = () => {
    const guess = parseInt(currentGuess);

    // Kiểm tra input hợp lệ
    if (isNaN(guess) || guess < 1 || guess > 100) {
      message.error('Vui lòng nhập một số từ 1 đến 100!');
      return;
    }

    const newGuessesLeft = guessesLeft - 1;
    setGuessesLeft(newGuessesLeft);

    // Kiểm tra kết quả
    if (guess === randomNumber) {
      setFeedback('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else if (newGuessesLeft === 0) {
      setFeedback(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
      setGameOver(true);
    } else if (guess < randomNumber) {
      setFeedback('Bạn đoán quá thấp!');
    } else {
      setFeedback('Bạn đoán quá cao!');
    }

    setCurrentGuess('');
  };

  return (
    <div className="guess-number-game">
      <Title level={2}>Trò chơi đoán số</Title>
      <Text>Số lượt đoán còn lại: {guessesLeft}</Text>
      
      <div className="game-content">
        <Text>{feedback}</Text>
        
        <div className="game-input">
          <Input
            type="number"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            onPressEnter={handleGuess}
            disabled={gameOver}
            placeholder="Nhập số từ 1-100"
          />
          
          <Button 
            type="primary"
            onClick={handleGuess}
            disabled={gameOver || !currentGuess}
          >
            Đoán
          </Button>
        </div>

        {gameOver && (
          <Button type="primary" onClick={initializeGame}>
            Chơi lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default GuessNumberGame;