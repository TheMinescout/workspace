import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { fetchPosts } from "../data/posts";

const PULL_QUOTES = [
  "There’s always something else to learn or try or build.",
  "A life well lived is built from things worth doing, people worth loving, and experiences worth remembering."
];

export default function About() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { fetchPosts().then(setPosts); }, []);

  return (
    <>
      <Header />
      <div className="about-layout">
        <main className="about-article">
          <div className="about-kicker">Minescout Life / About</div>
          <h1 className="about-title">About Me</h1>
          <article className="about-copy">
            <p>I’ve always liked figuring things out, whether it’s tech, programming, some random idea, or just something I’ve never seen before. I like messing around with stuff to see how it works and what I can do with it. Most of my interests come from just trying things out, following where an idea goes, and finding something new along the way. I don’t really fit into one box, and honestly, I think that’s a good thing. There’s always something else to learn or try or build.</p>

            <p>That curiosity is a big reason why I started Minescout. It’s turned into a bunch of projects, experiments, and ideas. With things like <strong>Minescout Studio</strong>, <strong>The Chop Lab</strong>, <strong>Minescout Life</strong>, and <strong>Minescout Beta</strong>, I’ve gotten to try out programming, AI, design, and even some entrepreneurship. Some projects actually go somewhere, some are just good for learning, and others just lead me to the next thing. I like the process as much as the end result—solving problems, making things better, and turning ideas into real stuff. I’m still figuring out how to do a lot of this, but that’s what keeps it interesting.</p>

            <p>But life isn’t just about computers and projects. I’m into photography, music (especially piano), Scouting, hanging out with my family, and trying out new things I haven’t done before. I like learning about the world, whether that’s picking up a new skill, figuring out a challenge, or just doing something different for a change. I don’t want to get so caught up in building stuff that I forget to actually enjoy everything else too. I try to leave things better than I found them, in every part of life.</p>

            <p>I have goals for the future, and I like thinking about what I could make or do. But honestly, I’m still figuring things out. I don’t have it all planned out, and I don’t really expect to. I’d rather keep learning, try out cool challenges, and build a life where I can be independent but still have time for the people and things that matter. The best way to predict the future is to build it.</p>

            <p>I try to keep things simple: I think a good life is about doing things that matter, being with people you care about, and making memories you’ll actually remember. A life well lived is built from things worth doing, people worth loving, and experiences worth remembering. I believe in making the future instead of just waiting for it, and in trying to leave things a bit better than I found them.</p>
          </article>
        </main>
        <aside className="about-quote-rail" aria-label="Pull quotes">
          {PULL_QUOTES.map(quote => (
            <blockquote className="about-pullquote" key={quote}>
              <p>“{quote}”</p>
              <cite>— TheMinescout</cite>
            </blockquote>
          ))}
        </aside>
      </div>
      <div className="page-layout">
        <div />
        <Sidebar posts={posts} />
      </div>
      <footer className="site-footer">
        <p className="footer-philosophy">Leave things better than you found them.</p>
        <p>Life of a Smart Kid · v5.0 · <a href="/admin">Admin</a></p>
      </footer>
    </>
  );
}
