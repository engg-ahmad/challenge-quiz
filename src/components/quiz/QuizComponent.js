import React, { Component } from 'react'
import shuffle from 'lodash/shuffle'

import questionsData from '../../questions.json'

class QuizComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      selectedQuestion: questionsData[0],
      nCorrect: 0,
      nIncorrect: 0
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

  calculateScore (nCorrect, nIncorrect) {
    const scores = { score: 0, maxScore: 100, minScore: 0 }
    if (nCorrect || nIncorrect) {
      const total = questionsData.length
      const attempted = nCorrect + nIncorrect
      const remaining = total - attempted
      const score = (nCorrect / attempted * 100)
      const maxScore = ((nCorrect + remaining) / total * 100)
      const minScore = (nCorrect / total * 100)
      scores.score = parseInt(score)
      scores.maxScore = parseInt(maxScore)
      scores.minScore = parseInt(minScore)
    }
    return scores
  }

  handleOption (option) {
    const selectedQuestion = this.state.selectedQuestion
    let nCorrect = this.state.nCorrect
    let nIncorrect = this.state.nIncorrect
    if (selectedQuestion.correct_answer === option) {
      nCorrect += 1
      selectedQuestion.isCorrect = true
    } else {
      nIncorrect += 1
    }
    selectedQuestion.selectedOption = option
    this.setState({ selectedQuestion, nCorrect, nIncorrect })
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
                      <div className='flex-row justify-center'>
                        {!selectedQuestion.selectedOption && <button type='button' className={'btn btn-secondary text-center min-width-200'} onClick={() => self.handleOption(option)}>{decodeURIComponent(option)}</button>}
                        {selectedQuestion.selectedOption && selectedQuestion.selectedOption === option && <button type='button' className={`btn ${selectedQuestion.selectedOption === selectedQuestion.correct_answer ? 'btn-success' : 'btn-dark o-1'} disabled text-center min-width-200`}>{decodeURIComponent(option)}</button>}
                        {selectedQuestion.selectedOption && selectedQuestion.selectedOption !== option && <button type='button' className={`btn ${option === selectedQuestion.correct_answer ? 'btn-success' : 'btn-dark'} disabled text-center min-width-200`}>{decodeURIComponent(option)}</button>}
                      </div>
                    </div>
                  )}
                </div>
                <div className='text-center m-tp-30 min-height-100'>
                  {selectedQuestion.selectedOption && selectedQuestion.isCorrect && <h3 className='clr-green'>Correct!</h3>}
                  {selectedQuestion.selectedOption && !selectedQuestion.isCorrect && <h3 className='clr-red'>Sorry!</h3>}
                  {selectedQuestion.selectedOption && (index + 1 < questionsData.length) && <button type='button' className='btn btn-primary' onClick={() => self.handleNext()}>Next Question</button>}
                  {(selectedQuestion.selectedOption && index + 1 === questionsData.length) && <h3 className='clr-orange'>Finished!</h3>}
                </div>
              </div>
              <div className='flex-row justify-between'>
                <b>Score: {this.calculateScore(self.state.nCorrect, self.state.nIncorrect).score}%</b>
                <b>Max Score: {this.calculateScore(self.state.nCorrect, self.state.nIncorrect).maxScore}%</b>
              </div>
              <div className='progress c-progress pos-r'>
                <div className='progress-bar c-progress-bar bg-score' style={{ width: this.calculateScore(self.state.nCorrect, self.state.nIncorrect).score + '%' }} />
                <div className='progress-bar c-progress-bar bg-minscore' style={{ width: this.calculateScore(self.state.nCorrect, self.state.nIncorrect).minScore + '%' }} />
                <div className='progress-bar c-progress-bar bg-maxscore' style={{ width: this.calculateScore(self.state.nCorrect, self.state.nIncorrect).maxScore + '%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default QuizComponent
