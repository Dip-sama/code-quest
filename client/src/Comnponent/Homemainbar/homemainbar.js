import React, { useEffect } from 'react'
import './Homemainbar.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Questionlist from './Questionlist'
import { fetchQuestions } from '../../store/slices/questionSlice'

function Homemainbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { data: questions, loading, error } = useSelector((state) => state.questions)

  useEffect(() => {
    dispatch(fetchQuestions())
  }, [dispatch])

  const checkauth = () => {
    if (!user) {
      alert("Login or signup to ask a question")
      navigate("/login")
    } else {
      navigate("/Askquestion")
    }
  }

  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Questions</h1>
        ) : (
          <h1>All Questions</h1>
        )}
        <button className="ask-btn" onClick={checkauth}>Ask Question</button>
      </div>
      <div>
        {loading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>Error: {error}</h1>
        ) : questions ? (
          <>
            <p>{questions.length} questions</p>
            <Questionlist questionlist={questions} />
          </>
        ) : (
          <h1>No questions found</h1>
        )}
      </div>
    </div>
  )
}

export default Homemainbar