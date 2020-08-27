import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { QandAsDocument } from '../types';

type Props = {
  qandas: QandAsDocument /* q and a's -- questions and answers document */;
};

const PollWrapper = styled.div`
  padding: 20px;
  border-radius: 5px;
  background: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 50%;
  margin: auto;
  & h2 {
    margin-bottom: 20px;
  }
  & .answer {
    padding: 10px;
    border-radius: 7px;
    background: white;
    border: 1px solid #999;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 10px;
    & .meter {
      position: absolute;
      left: 0;
      height: -webkit-fill-available;
      top: 0;
      border-bottom-left-radius: 7px;
      border-top-left-radius: 7px;
      overflow: hidden;
      & span {
        display: block;
        height: 100%;
      }
    }

    & .progress {
      background-color: #e8e8e8;
      animation: progressBar 1s ease-in-out;
      animation-fill-mode: both;
    }

    & .progress-max {
      background-color: cyan;
      animation: progressBar 1s ease-in-out;
      animation-fill-mode: both;
    }

    @keyframes progressBar {
      0% {
        width: 0;
      }
      100% {
        width: 100%;
      }
    }

    & .animalname {
      z-index: 1;
    }
    & .circlecheck {
      height: 20px;
      z-index: 1;
      margin-left: 15px;
    }
    & .divitem {
      display: flex;
    }
  }
`;

export default function Poll({ qandas }: Props) {
  console.log('questions and answers: ', qandas);
  const [total_votes, setTotalvotes] = useState(0);
  const [total_click, setTotalclick] = useState(0);
  const [max_index, setMaxindex] = useState(0);
  const [clicked, setClicked] = useState({ parent: -1, children: -1 });
  const [activeQuestion, setActiveQuestion] = useState(0);
  const handleAnswerClick = (i: any, index: any) => {
    setTotalclick(total_click + 1);
    setClicked({ parent: i, children: index });
  };

  const randomQuestion = () => {
    const len = qandas.questions.length;
    var randomnum = Math.floor(Math.random() * len);
    var totalval = 0;
    var maxval = 0;

    setActiveQuestion(randomnum);

    qandas.questions[randomnum].answers.map((answer, index) => {
      totalval += answer.votes;
      if (maxval < answer.votes) {
        maxval = answer.votes;
        setMaxindex(index);
      }
    });
    setTotalvotes(totalval);
  };

  useEffect(() => {
    randomQuestion();
  }, []);

  return (
    <PollWrapper>
      <div>
        <h2>{qandas.questions[activeQuestion].question.text}</h2>
        {qandas.questions[activeQuestion].answers.map((answer, index) => (
          <div
            className="answer"
            onClick={() => handleAnswerClick(activeQuestion, index)}
          >
            <div className="meter" style={{ width: '100%' }}>
              <span
                style={{
                  width: Math.round((answer.votes / total_votes) * 100) + '%',
                }}
              >
                <span
                  className={max_index === index ? 'progress-max' : 'progress'}
                ></span>
              </span>
            </div>
            <div className="divitem">
              <span
                className="animalname"
                style={{ fontWeight: max_index === index ? 'bold' : 'normal' }}
              >
                {answer.text}
              </span>
              {clicked.children === index && (
                <img
                  src={require('../static/check-circle.svg')}
                  className="circlecheck"
                />
              )}
            </div>
            <span
              style={{ fontWeight: max_index === index ? 'bold' : 'normal' }}
            >
              {Math.round((answer.votes / total_votes) * 100) + '%'}
            </span>
          </div>
        ))}
        <p>{total_click} votes</p>
      </div>
    </PollWrapper>
  );
}
