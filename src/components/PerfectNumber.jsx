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
    <div className="bg-gray-100 p-8 w-[780px] overflow-auto">
      <Card className="w-[748px] mx-auto shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg w-[748px]">
          <h1 className="text-sky-900 text-2xl font-bold">Perfect Numbers</h1>
          <p className="text-sky-800">Learn how to identify perfect numbers!</p>
        </div>

        <CardContent className="space-y-6 pt-6 w-[748px]">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is a Perfect Number?</h2>
            <p className="text-blue-600">
              A perfect number is a positive integer that equals the sum of all its proper divisors (excluding the number itself).
            </p>
          </div>

          <Card className="border border-gray-200">
            <CardContent className="space-y-4 pt-4 p-6">
              <h2 className="font-semibold mb-2">Example:</h2>
              <div>
                <p className="font-semibold">6 is a perfect number because:</p>
                <p>Proper divisors of 6 are: 1, 2, 3</p>
                <p>1 + 2 + 3 = 6</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <div className="flex gap-2">
                {numbers.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx < currentIndex ? 'w-3 h-3 bg-green-500' : 
                      idx === currentIndex ? 'w-2 h-2 bg-purple-600 mt-0.5' : 
                      'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-2xl mb-4">
              <span className="font-bold">{numbers[currentIndex]}</span>
            </div>

            <div className="space-y-4">
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
                      className={`w-48 text-center ${
                        hasError.divisors ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="e.g., 1, 2, 3"
                    />
                    <div className="flex gap-4">
                      <Button 
                        onClick={checkDivisors}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => {
                          setDivisorsInput(findProperDivisors(numbers[currentIndex]).join(', '));
                          setDivisorsChecked(true);
                        }}
                        className="bg-gray-400 hover:bg-gray-500"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-600 font-bold">
                    {findProperDivisors(numbers[currentIndex]).join(', ')}
                  </p>
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
                        className={`w-32 text-center ${
                          hasError.perfect ? 'border-red-500 focus:border-red-500' : 'border-blue-300'
                        }`}
                        placeholder="yes or no"
                      />
                      <div className="flex gap-4">
                        <Button 
                          onClick={checkPerfect}
                          className="bg-blue-400 hover:bg-blue-500"
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
                          className="bg-gray-400 hover:bg-gray-500"
                        >
                          Skip
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-green-600 font-bold">
                      {(() => {
                        const divisors = findProperDivisors(numbers[currentIndex]);
                        const sum = divisors.reduce((a, b) => a + b, 0);
                        return sum === numbers[currentIndex] ? 'Yes' : 'No';
                      })()}
                    </p>
                  )}
                </div>
              )}

              {isPerfectChecked && (
                <div id="success-box" className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                  <p className="text-green-700">
                    You've successfully analyzed {numbers[currentIndex]}!
                  </p>
                  <Button
                    onClick={currentIndex === numbers.length - 1 ? resetPractice : nextQuestion}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {currentIndex === numbers.length - 1 ? 'Start Over' : 'Next Number'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Studying perfect numbers helps us understand number properties and patterns better.
      </p>
    </div>
  );
};

export default PerfectNumber;