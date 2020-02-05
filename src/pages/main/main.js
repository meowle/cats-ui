import React from 'react'
import history from '../../utils/history'
import './main.css'

export class MainPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchName: '',
      some: 2,
    }
  }

  onKeyUp(event) {
    this.setState({ searchName: event.target.value })

    if (event.key === 'Enter') {
      this.search()
    }
  }

  search() {
    history.push(`/search/${this.state.searchName}`)
  }

  // TODO добавить стили (отсутпы, размер шрифта)
  render() {
    return (
      <section className="section full-size">
        <div className="container full-size">
          <div className="columns is-mobile is-vcentered full-size">
            <div className="column is-8 is-offset-2">
              <div className="columns">
                <div className="column">
                  <h1>meowle</h1>
                </div>
                <div className="column is-hidden-mobile">
                  <figure className="image is-128x128 is-pulled-right">
                    <img src="/img/cat.png" />
                  </figure>
                </div>
              </div>
              <div>
                <div className="field">
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder="Введите часть имени"
                      autoComplete="off"
                      onKeyUp={this.onKeyUp.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
