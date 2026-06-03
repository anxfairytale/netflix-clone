import React from "react";
import "../styles/LandingView.css";
import gradient from "../assets/gradient.png";

function LandingPage() {
  return (
    <section className="landing-page">
      <img className="image-gradient" src={gradient} alt="" />
      <div className="layer-blur"></div>

      <header>
        <h1 className="logo">YouFlicks</h1>

        <a href="/login" className="btn-signing">Sign in</a>
      </header>

      <main>
        <div className="content">
          <div className="tag-box">
            <div className="tag">INTRODUCING ✦</div>
          </div>

          <h1>ENTERTAINMENT FOR EVERYONE</h1>

          <p className="description">
            The one stop solution for all your dopamine needs,
            explore a variety of content curated just for you.
          </p>

          <div className="buttons">
            <a href="/home" className="btn-get-started">Explore &gt;</a>
            <a href="/login" className="btn-signing-main">Get Started &gt;</a>
          </div>
        </div>
      </main>
    </section>
  );
}

export default LandingPage;