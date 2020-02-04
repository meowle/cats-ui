import React from 'react'
import './main.css'

function App() {
  // const text = CatsApi.getAll()

  // TODO добавить стили (отсутпы, размер шрифта)
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
            <form>
              <div className="field">
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    placeholder="Введите часть имени"
                    autocomplete="off"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
