import "./App.css"
import redditLogo from "./images/redditLogo.png"
import githubLogo from "./images/githubLogo.png"
import emailLogo from "./images/emailLogo.png"
import youtubeLogo from "./images/youtubeLogo.png"

function App() {
  return (
    <>
      <header>
        <h1 id="site-title">My first webpage</h1>
        <button id="log-in">Log In</button>
        <button id="sign-up">Sign Up</button>
      </header>
      <footer>
        <ul className="my-links">
          <li className="is-horizontal">
            <a href="https://www.reddit.com/user/IncendioHawk">
              <img
                className="expand-on-hover"
                src={redditLogo}
                alt="Reddit Logo"
              />
            </a>
          </li>
          <li className="is-horizontal">
            <a href="https://www.youtube.com/channel/UCbp7aM2xTk3D-xYz-ZX4WOQ">
              <img
                className="expand-on-hover"
                src={youtubeLogo}
                alt="Youtube Logo"
              />
            </a>
          </li>
          <li className="is-horizontal">
            <a href="mailto:incendiohawk@gmail.com">
              <img
                className="expand-on-hover"
                src={emailLogo}
                alt="Email Logo"
              />
            </a>
          </li>
          <li className="is-horizontal">
            <a href="https://github.com/IncendioHawk">
              <img
                className="expand-on-hover"
                src={githubLogo}
                alt="Github Logo"
              />
            </a>
          </li>
        </ul>
      </footer>
      <p id="start-date">Created 24/10/2022</p>
    </>
  )
}

export default App
