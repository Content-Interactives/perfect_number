import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const PerfectNumber = () => {
  const numbers = [4, 6, 11, 20, 28];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [divisorsInput, setDivisorsInput] = useState('');
  const [isPerfectInput, setIsPerfectInput] = useState('');
  const [divisorsChecked, setDivisorsChecked] = useState(false);
  const [isPerfectChecked, setIsPerfectChecked] = useState(false);
  const [hasError, setHasError] = useState({
    divisors: false,
    perfect: false
  });

  const resetPractice = () => {
    setCurrentIndex(0);
    setDivisorsInput('');
    setIsPerfectInput('');
    setDivisorsChecked(false);
    setIsPerfectChecked(false);
    setHasError({ divisors: false, perfect: false });
  };

  const nextQuestion = () => {
    const nextIndex = (currentIndex + 1) % numbers.length;
    setCurrentIndex(nextIndex);
    setDivisorsInput('');
    setIsPerfectInput('');
    setDivisorsChecked(false);
    setIsPerfectChecked(false);
    setHasError({ divisors: false, perfect: false });
  };

  const findProperDivisors = (num) => {
    const divisors = [];
    for (let i = 1; i < num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const isCorrectDivisors = () => {
    const correctDivisors = findProperDivisors(numbers[currentIndex]);
    const userDivisors = divisorsInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    return JSON.stringify(userDivisors.sort((a,b) => a-b)) === JSON.stringify(correctDivisors);
  };

  const isCorrectPerfect = () => {
    const divisors = findProperDivisors(numbers[currentIndex]);
    const sum = divisors.reduce((a, b) => a + b, 0);
    const isPerfect = sum === numbers[currentIndex];
    return (isPerfectInput.toLowerCase() === 'yes' && isPerfect) || 
           (isPerfectInput.toLowerCase() === 'no' && !isPerfect);
  };

  const checkDivisors = () => {
    const isCorrect = isCorrectDivisors();
    setHasError(prev => ({ ...prev, divisors: !isCorrect }));
    if (isCorrect) setDivisorsChecked(true);
  };

  const checkPerfect = () => {
    const isCorrect = isCorrectPerfect();
    setHasError(prev => ({ ...prev, perfect: !isCorrect }));
    if (isCorrect) {
      setIsPerfectChecked(true);
      setTimeout(() => {
        document.getElementById('success-box').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: rgb(250, 245, 255);
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4 w-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Perfect Numbers Practice</h2>
            <button
              onClick={resetPractice}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 w-[468px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Number {currentIndex + 1}</h2>
              <div className="flex gap-2">
                {numbers.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx < currentIndex ? 'w-3 h-3 bg-[#008545]' : 
                      idx === currentIndex ? 'w-2 h-2 bg-[#5750E3] mt-0.5' : 
                      'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-[436px]">
              <p className="font-medium text-sm">Analyze the following number:</p>
              <p className="mt-2 font-semibold text-2xl text-center">{numbers[currentIndex]}</p>
            </div>

            <div className="space-y-4 w-[436px]">
              <div>
                <p className="text-purple-900 mb-2">1. What are the proper divisors?</p>
                {!divisorsChecked ? (
                  <div className="flex items-center gap-4 my-4">
                    <Input
                      type="text"
                      value={divisorsInput}
                      onChange={(e) => {
                        setDivisorsInput(e.target.value);
                        if (hasError.divisors) setHasError(prev => ({ ...prev, divisors: false }));
                      }}
                      className={`w-[200px] text-center ${
                        hasError.divisors ? 'border-red-500 focus:border-red-500' : 'border-[#5750E3]'
                      }`}
                      placeholder="e.g., 1, 2, 3"
                    />
                    <div className="glow-button simple-glow">
                      <div className="flex gap-4">
                        <Button 
                          onClick={checkDivisors}
                          className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                        >
                          Check
                        </Button>
                        <Button
                          onClick={() => {
                            setDivisorsInput(findProperDivisors(numbers[currentIndex]).join(', '));
                            setDivisorsChecked(true);
                          }}
                          className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded"
                        >
                          Skip
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#008545]/10 border border-[#008545] p-4 rounded-lg w-[436px]">
                    <p className="text-[#008545] font-bold">
                      {findProperDivisors(numbers[currentIndex]).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {divisorsChecked && (
                <div>
                  <p className="text-purple-900 mb-2">2. Is it a perfect number?</p>
                  {!isPerfectChecked ? (
                    <div className="flex items-center gap-4 my-4">
                      <Input
                        type="text"
                        value={isPerfectInput}
                        onChange={(e) => {
                          setIsPerfectInput(e.target.value);
                          if (hasError.perfect) setHasError(prev => ({ ...prev, perfect: false }));
                        }}
                        className={`w-[120px] text-center ${
                          hasError.perfect ? 'border-red-500 focus:border-red-500' : 'border-[#5750E3]'
                        }`}
                        placeholder="yes or no"
                      />
                      <div className="glow-button simple-glow">
                        <div className="flex gap-4">
                          <Button 
                            onClick={checkPerfect}
                            className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => {
                              const divisors = findProperDivisors(numbers[currentIndex]);
                              const sum = divisors.reduce((a, b) => a + b, 0);
                              setIsPerfectInput(sum === numbers[currentIndex] ? 'yes' : 'no');
                              setIsPerfectChecked(true);
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#008545]/10 border border-[#008545] p-4 rounded-lg w-[436px]">
                      <p className="text-[#008545] font-bold">
                        {(() => {
                          const divisors = findProperDivisors(numbers[currentIndex]);
                          const sum = divisors.reduce((a, b) => a + b, 0);
                          return sum === numbers[currentIndex] ? 'Yes' : 'No';
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isPerfectChecked && (
                <div id="success-box" className="bg-[#008545]/10 border border-[#008545] rounded-lg p-4 mt-4 w-[436px]">
                  <h3 className="text-[#008545] text-xl font-bold">Great Work!</h3>
                  <p className="text-[#008545]">
                    You've successfully analyzed {numbers[currentIndex]}!
                  </p>
                  <div className="glow-button simple-glow mt-4">
                    <Button
                      onClick={currentIndex === numbers.length - 1 ? resetPractice : nextQuestion}
                      className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded"
                    >
                      {currentIndex === numbers.length - 1 ? 'Start Over' : 'Next Number'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfectNumber;