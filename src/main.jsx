import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./styles.css";
import { birthdayData } from "./data/birthdayData";

const cats = ["🐱","😽","😺","😸","😻","😹","😼","🙀"];

function FloatingHearts({ count = 18 }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 5,
    duration: 5 + Math.random() * 5, size: 14 + Math.random() * 18
  })), [count]);
  return <div className="float-layer" aria-hidden="true">
    {items.map(x => <span key={x.id} className="floating-heart"
      style={{left:`${x.left}%`, animationDelay:`${x.delay}s`, animationDuration:`${x.duration}s`, fontSize:x.size}}>
      {x.id % 3 === 0 ? "♡" : "♥"}
    </span>)}
  </div>;
}

function Cat({ index = 0, interactive = false, className = "" }) {
  const [message, setMessage] = useState("");
  const click = () => {
    if (!interactive) return;
    const messages = ["meow! 🎀", "She said HAPPY BIRTHDAY! 💗", "besties forever 🐾", "pspspsps... ✨"];
    setMessage(messages[index % messages.length]);
    setTimeout(() => setMessage(""), 1600);
  };
  return <div className={`cat-wrap ${className}`} onClick={click} role={interactive ? "button" : undefined} tabIndex={interactive ? 0 : undefined}>
    <motion.div animate={{ y:[0,-5,0], rotate:[-2,2,-2] }} transition={{duration:3+index*.15, repeat:Infinity, ease:"easeInOut"}} className="cat">
      {cats[index % cats.length]}
    </motion.div>
    {message && <motion.div initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} className="cat-bubble">{message}</motion.div>}
  </div>
}

function BirthdayEntry({ onEnter }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const v = value.toLowerCase().replace(/\s+/g,"");
    const valid = v.includes("7oct") || v.includes("7thoct") || v === "07/10" || v === "7/10" || v === "0710";
    if (valid) onEnter();
    else setError("Ummm... that's not the secret birthday! 🐱💕 Try again!");
  };

  return <section className="screen entry-screen">
    <FloatingHearts count={12}/>
    <div className="paper-corner note-top">a very<br/><b>special day</b><br/>awaits... ♡</div>
    <div className="entry-doodles">✦　♡　✿　🎀　✧</div>
    <motion.div className="entry-card" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}}>
      <p className="eyebrow">HEY BESTIE ♡</p>
      <h1>What's your<br/>birthday?</h1>
      <p className="subtitle">Tell me your special day so we can begin... ♡</p>
      <form onSubmit={submit}>
        <div className="date-field">
          <span>🎀</span>
          <input value={value} onChange={e=>{setValue(e.target.value);setError("")}} placeholder="e.g. 7th Oct" aria-label="Birthday"/>
        </div>
        <button className="cute-button" type="submit">Let's Go! <span>→</span></button>
      </form>
      {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="error">{error}</motion.p>}
    </motion.div>
    <Cat index={4} className="entry-cat"/>
    <div className="tiny-note">Good things happen<br/>on this day! ♡</div>
  </section>
}

function Celebration({ onCake }) {
  useEffect(() => {
    confetti({particleCount:120, spread:110, origin:{y:.35}});
    const t = setTimeout(() => confetti({particleCount:70, spread:90, origin:{x:.15,y:.5}}), 500);
    return () => clearTimeout(t);
  }, []);
  return <section className="screen celebration-screen">
    <FloatingHearts count={24}/>
    <div className="party-popper left">🎉</div><div className="party-popper right">🎊</div>
    <div className="celebration-title">
      <p className="eyebrow">IT'S YOUR DAY!!! 🎀</p>
      <h2>HAPPY BIRTHDAY,<br/><span>BESTIE! 💗</span></h2>
      <p>Today the whole tiny universe is celebrating you.</p>
    </div>
    <div className="cake-stage">
      {[0,1,2,3,4,5].map((i)=><Cat key={i} index={i} interactive className={`cake-cat cat-${i}`}/>)}
      <div className="gift gift-1">🎁</div><div className="gift gift-2">🎀</div>
      <BirthdayCake onClick={onCake}/>
    </div>
    <div className="tap-hint">Make a wish... ✨<br/><b>Tap the cake to cut it! 🎂</b></div>
  </section>
}

function BirthdayCake({ onClick, cut }) {
  return <motion.button className={`cake ${cut ? "cake-cut":""}`} onClick={onClick} aria-label="Cut birthday cake">
    <div className="candles">{[1,2,3,4,5].map(i=><span key={i} className="candle"><i/></span>)}</div>
    <div className="cake-top">♡ ♡ ♡</div>
    <div className="cake-layer top-layer"/>
    <div className="cake-layer mid-layer"/>
    <div className="cake-layer bottom-layer"/>
    <div className="cake-plate"/>
  </motion.button>
}

function CakeReveal({ onOpen }) {
  const [cut, setCut] = useState(false);
  const handle = () => {
    setCut(true);
    confetti({particleCount:180, spread:120, startVelocity:35, origin:{y:.6}});
    setTimeout(onOpen, 1800);
  };
  return <section className="screen cake-screen">
    <FloatingHearts count={22}/>
    <div className="cake-reveal-title"><p className="eyebrow">ONE MORE LITTLE THING...</p><h2>Make a wish, birthday girl! ✨</h2></div>
    <div className="reveal-stage">
      <BirthdayCake onClick={handle} cut={cut}/>
      <div className="reveal-cats">{[0,2,4,6].map(i=><Cat key={i} index={i} interactive/>)}</div>
      <AnimatePresence>
        {cut && <motion.div className="inside-message" initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{opacity:0}}>
          <span>YAYYY! 💗</span><small>You found the sweetest surprise!</small>
        </motion.div>}
      </AnimatePresence>
    </div>
    {!cut && <p className="tap-hint">Tap the cake 🎂</p>}
    {cut && <motion.button className="cute-button" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} onClick={onOpen}>Open Scrapbook → 📖</motion.button>}
  </section>
}

function MemoryPhoto({ photo, index }) {
  return <motion.figure className="memory-photo" style={{"--rotate":`${photo.rotation ?? (index%2?2:-3)}deg`}}
    initial={{opacity:0, y:20, rotate:0}} whileInView={{opacity:1,y:0,rotate:photo.rotation ?? (index%2?2:-3)}} viewport={{once:true}} whileHover={{scale:1.04, rotate:0}}>
    <div className="washi">{photo.tape || "♡"}</div>
    <div className="photo-frame">
      <img src={photo.image} alt={photo.caption || "Birthday memory"} onError={(e)=>{e.currentTarget.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23fff4f0'/%3E%3Ctext x='50%25' y='48%25' dominant-baseline='middle' text-anchor='middle' font-family='cursive' font-size='30' fill='%23c78296'%3EYour photo here ♡%3C/text%3E%3Ctext x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%23c78296'%3Epublic/images/%3C/text%3E%3C/svg%3E"}}/>
    </div>
    <figcaption>{photo.caption}</figcaption>
    {photo.date && <small>{photo.date}</small>}
  </motion.figure>
}

function Scrapbook({ onLetter }) {
  const [page,setPage] = useState(0);
  const current = birthdayData.scrapbookPages[page];
  return <section className="screen scrapbook-screen">
    <FloatingHearts count={12}/>
    <div className="book-header"><p className="eyebrow">A LITTLE TRIP DOWN MEMORY LANE</p><h2>Our Scrapbook ♡</h2></div>
    <div className="book">
      <div className="rings">{Array.from({length:7},(_,i)=><span key={i}/>)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={page} className="spread" initial={{opacity:0,rotateY:page%2?8:-8,x:30}} animate={{opacity:1,rotateY:0,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.45}}>
          <div className="book-page left-page">
            <div className="page-flower">✿</div>
            <h3>{current.title}</h3>
            <p className="hand-note">{current.note}</p>
            <div className="photo-grid">
              {current.photos.slice(0,3).map((p,i)=><MemoryPhoto key={i} photo={p} index={i}/>)}
            </div>
          </div>
          <div className="book-page right-page">
            <div className="sticker">BEST<br/>MEMORIES<br/>♡</div>
            <p className="hand-note center">{current.rightNote}</p>
            <div className="photo-grid two">
              {current.photos.slice(3).map((p,i)=><MemoryPhoto key={i} photo={p} index={i+3}/>)}
            </div>
            <div className="cat-sticker">🐱</div>
            <div className="doodle">xoxo<br/>✧ ♡ ✧</div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button className="page-arrow prev" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>‹</button>
      <button className="page-arrow next" onClick={()=>setPage(p=>Math.min(birthdayData.scrapbookPages.length-1,p+1))} disabled={page===birthdayData.scrapbookPages.length-1}>›</button>
    </div>
    <div className="page-dots">{birthdayData.scrapbookPages.map((_,i)=><button key={i} className={i===page?"active":""} onClick={()=>setPage(i)} aria-label={`Open scrapbook page ${i+1}`}/>)}</div>
    {page === birthdayData.scrapbookPages.length-1 && <button className="cute-button" onClick={onLetter}>There's One More Thing... 💌</button>}
  </section>
}


function BonusMemories({ onContinue }) {
  const bonusPhotos = birthdayData.bonusMemories;
  return <section className="screen bonus-screen">
    <FloatingHearts count={28}/>
    <div className="bonus-confetti" aria-hidden="true">✦　🎀　♡　✿　🎀　♡　✦</div>
    <div className="bonus-header">
      <p className="eyebrow">PSSST... ONE MORE THING 👀</p>
      <h2>WAITTT...<br/><span>THERE'S MORE?! 🎀</span></h2>
      <p>Because apparently 25 memories weren't enough... 😭💗</p>
    </div>
    <div className="bonus-grid">
      {bonusPhotos.map((photo, i) => (
        <MemoryPhoto key={i} photo={photo} index={i + 26}/>
      ))}
    </div>
    <motion.div className="bonus-note" initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
      <span>♡</span>
      <p>And these seven little moments deserve their own page.</p>
      <span>♡</span>
    </motion.div>
    <button className="cute-button" onClick={onContinue}>Okay... now for the letter 💌</button>
  </section>
}

function Letter({ onFinish }) {
  return <section className="screen letter-screen">
    <FloatingHearts count={26}/>
    <div className="letter-wrap">
      <p className="eyebrow">SOMETHING I WANTED TO TELL YOU ♡</p>
      <h2>A Little Letter For You 💌</h2>
      <motion.article className="letter-paper" initial={{opacity:0,y:30,rotate:-2}} animate={{opacity:1,y:0,rotate:0}}>
        <div className="paperclip">♡</div>
        <h3>To my favorite person,</h3>
        <div className="letter-text">{birthdayData.letter.split("\n").map((p,i)=><p key={i}>{p}</p>)}</div>
        <p className="signature">Happy Birthday, my bestie. ♡<br/><span>Always, your partner in crime 🎀</span></p>
        <Cat index={5}/>
      </motion.article>
      <button className="cute-button" onClick={onFinish}>One Last Surprise ✨</button>
    </div>
  </section>
}

function Final({ onRestart }) {
  useEffect(()=>{ confetti({particleCount:220,spread:160,origin:{y:.45}}); },[]);
  return <section className="screen final-screen">
    <FloatingHearts count={35}/>
    <div className="final-stars">✦ ✧ ✦ ✧ ✦</div>
    <p className="eyebrow">AND NOW, THE MOST IMPORTANT PART...</p>
    <h1>HAPPY BIRTHDAY,<br/><span>MY BESTIE! 🎀</span></h1>
    <p className="final-sub">Here's to another year of being completely ridiculous together. ♡</p>
    <div className="final-photo">
      <img src={birthdayData.finalPhoto} alt="Our favorite memory" />
      <div className="photo-fallback">YOUR FAVOURITE PHOTO ♡</div>
    </div>
    <p className="love">Love you forever & always. 💗</p>
    <p className="sign">— Your Partner in Crime 🎀</p>
    <button className="tiny-restart" onClick={onRestart}>↻ replay our little story</button>
  </section>
}

function App() {
  const [screen,setScreen] = useState("entry");
  const [music,setMusic] = useState(false);
  const audio = useRef(null);

  useEffect(()=>{
    if(!audio.current) return;
    if(music) audio.current.play().catch(()=>setMusic(false));
    else audio.current.pause();
  },[music]);

  const go = (s) => {
    setScreen(s);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  return <main>
    <audio ref={audio} loop src="/music/birthday.mp3"/>
    <button className="music" onClick={()=>setMusic(v=>!v)} aria-label="Toggle music">{music ? "🔊" : "🎵"}</button>
    <AnimatePresence mode="wait">
      {screen==="entry" && <motion.div key="entry" exit={{opacity:0,scale:1.03}}><BirthdayEntry onEnter={()=>go("celebration")}/></motion.div>}
      {screen==="celebration" && <motion.div key="celebration" exit={{opacity:0,y:-15}}><Celebration onCake={()=>go("cake")}/></motion.div>}
      {screen==="cake" && <motion.div key="cake" exit={{opacity:0,y:-15}}><CakeReveal onOpen={()=>go("scrapbook")}/></motion.div>}
      {screen==="scrapbook" && <motion.div key="scrapbook" exit={{opacity:0,y:-15}}><Scrapbook onLetter={()=>go("bonus")}/></motion.div>}
      {screen==="bonus" && <motion.div key="bonus" exit={{opacity:0,y:-15}}><BonusMemories onContinue={()=>go("letter")}/></motion.div>}
      {screen==="letter" && <motion.div key="letter" exit={{opacity:0,y:-15}}><Letter onFinish={()=>go("final")}/></motion.div>}
      {screen==="final" && <motion.div key="final" exit={{opacity:0}}><Final onRestart={()=>go("entry")}/></motion.div>}
    </AnimatePresence>
  </main>
}

createRoot(document.getElementById("root")).render(<App />);