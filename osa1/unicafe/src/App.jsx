import { useState } from 'react'

const Statistics = ({ good, neutral, bad, count, average, posshare }) => {
  if (count === 0) {
    return(
      <div>
        <h1>
        statistics
        </h1>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <h1>
        statistics
      </h1>
      <table>
      <tbody>
      <StatisticsLine text='good' value={good} />
      <StatisticsLine text='neutral' value={neutral} />
      <StatisticsLine text='bad' value={bad} />
      <StatisticsLine text='count' value={count} />
      <StatisticsLine text='average' value={average} />
      <StatisticsLine text='posshare' value={posshare} />
      </tbody>
      </table>
    </div>
  )
}

const Button = ({ handleClick, text }) => {
  return ( 
  <button onClick={handleClick}>
    {text}
  </button>
  )
}

const StatisticsLine = ({ text, value }) => {
  if (text === 'posshare') {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    )
  }
  return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [count, setCount] = useState(0)
  const [points, setPoints] = useState(0)
  const [average, setAverage] = useState(0)
  const [posshare, setPosshare] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    const updatedCount = count + 1
    setCount(updatedCount)
    const updatedPoints = points + 1
    setPoints(updatedPoints)
    setAverage(updatedPoints / updatedCount)
    setPosshare(updatedGood / updatedCount * 100)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    const updatedCount = count + 1
    setCount(updatedCount)
    setAverage(points / updatedCount)
    setPosshare(good / updatedCount * 100)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    const updatedCount = count + 1
    setCount(updatedCount)
    const updatedPoints = points - 1
    setPoints(updatedPoints)
    setAverage(updatedPoints / updatedCount)
    setPosshare(good / updatedCount * 100)
  }

  return (
    <div>
      <h1> give feedback </h1>
      
      <Button handleClick={handleGoodClick} text='good'/>

      <Button handleClick={handleNeutralClick} text='neutral'/>

      <Button handleClick={handleBadClick} text='bad'/>

      <Statistics good={good} neutral={neutral} bad={bad} count={count} average={average} posshare={posshare}/>

    </div>
  )
}

export default App
