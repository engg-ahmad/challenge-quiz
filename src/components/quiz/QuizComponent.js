import React, { Component } from 'react'
import shuffle from 'lodash/shuffle'

import questionsData from '../../questions.json'

class QuizComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      selectedQuestion: questionsData[0],
      corrected: 0,
      incorrected: 0
    }
  }

  componentDidMount () {
    const selectedQuestion = this.state.selectedQuestion
    this.getShuffledOptions(selectedQuestion)
  }

  getShuffledOptions (selectedQuestion) {
    const options = selectedQuestion.incorrect_answers
    options.push(selectedQuestion.correct_answer)
    const shuffledOptions = shuffle(options)
    selectedQuestion.shuffledOptions = shuffledOptions
    this.setState({ selectedQuestion })
  }

  calculateScore (corrected, incorrected) {
    const scores = { score: 0, maxScore: 100, minScore: 0 }
    if (corrected || incorrected) {
      const total = questionsData.length
      const attempted = corrected + incorrected
      const remaining = total - attempted
      const score = (corrected / attempted * 100)
      const maxScore = ((corrected + remaining) / total * 100)
      const minScore = (corrected / total * 100)
      scores.score = parseInt(score)
      scores.maxScore = parseInt(maxScore)
      scores.minScore = parseInt(minScore)
    }
    return scores
  }

  handleOption (option) {
    const selectedQuestion = this.state.selectedQuestion
    let corrected = this.state.corrected
    let incorrected = this.state.incorrected
    if (selectedQuestion.correct_answer === option) {
      corrected += 1
      selectedQuestion.isCorrect = true
    } else {
      incorrected += 1
    }
    selectedQuestion.selectedOption = option
    this.setState({ selectedQuestion, corrected, incorrected })
  }

  handleNext () {
    let index = this.state.index
    const selectedQuestion = questionsData[index + 1]
    if (selectedQuestion) {
      this.getShuffledOptions(selectedQuestion)
      index += 1
      this.setState({ index })
    }
  }

  render () {
    const self = this
    const index = self.state.index
    const selectedQuestion = this.state.selectedQuestion
    const options = selectedQuestion.shuffledOptions ? selectedQuestion.shuffledOptions : []
    const progressPerc = (((index + 1) / questionsData.length) * 100) + '%'
    return (
      <div>
        <div className='progress'>
          <div className='progress-bar bg-secondary' style={{ width: progressPerc }} />
        </div>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-md-8'>
              <div className='m-tp-30'>
                <h2>Question {index + 1} of {questionsData.length}</h2>
                <div>{decodeURIComponent(selectedQuestion.category)}</div>
                <span className={`fa fa-star ${(selectedQuestion.difficulty === 'easy' || selectedQuestion.difficulty === 'medium' || selectedQuestion.difficulty === 'hard') ? 'clr-orange' : ''}`} />
                <span className={`fa fa-star ${(selectedQuestion.difficulty === 'medium' || selectedQuestion.difficulty === 'hard') ? 'clr-orange' : ''}`} />
                <span className={`fa fa-star ${(selectedQuestion.difficulty === 'hard') ? 'clr-orange' : ''}`} />
              </div>
              <div className='m-tp-30'>
                <h5>{decodeURIComponent(selectedQuestion.question)}</h5>
                <div className='row min-height-200'>
                  {options.map((option, j) =>
                    <div key={j + 1} className='col-md-6 m-tp-10'>
                      {!selectedQuestion.selectedOption && <button type='button' className='btn btn-secondary text-center min-width-200' onClick={() => self.handleOption(option)}>{decodeURIComponent(option)}</button>}
                      {selectedQuestion.selectedOption && <button type='button' className={`btn ${selectedQuestion.selectedOption === option ? 'btn-dark' : 'btn-secondary disabled'} text-center min-width-200`}>{decodeURIComponent(option)}</button>}
                    </div>
                  )}
                </div>
                <div className='text-center m-tp-30 min-height-100'>
                  {selectedQuestion.selectedOption && selectedQuestion.isCorrect && <h3 className='clr-green'>Correct!</h3>}
                  {selectedQuestion.selectedOption && !selectedQuestion.isCorrect && <h3 className='clr-red'>Sorry!</h3>}
                  {selectedQuestion.selectedOption && (index + 1 < questionsData.length) && <button type='button' className='btn btn-primary' onClick={() => self.handleNext()}>Next Question</button>}
                  {(index + 1 === questionsData.length) && <h3 className='clr-orange'>Finished!</h3>}
                </div>
              </div>
              <div className='flex-row justify-between'>
                <b>Score: {this.calculateScore(self.state.corrected, self.state.incorrected).score}%</b>
                <b>Max Score: {this.calculateScore(self.state.corrected, self.state.incorrected).maxScore}%</b>
              </div>
              <div className='progress c-progress pos-r'>
                <div className='progress-bar c-progress-bar bg-score' style={{ width: this.calculateScore(self.state.corrected, self.state.incorrected).score + '%' }} />
                <div className='progress-bar c-progress-bar bg-minscore' style={{ width: this.calculateScore(self.state.corrected, self.state.incorrected).minScore + '%' }} />
                <div className='progress-bar c-progress-bar bg-maxscore' style={{ width: this.calculateScore(self.state.corrected, self.state.incorrected).maxScore + '%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default QuizComponent
