import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, Sparkles, ArrowLeft, ArrowRight, Plus, Trash2, Copy, Share2, Award, Users, Smile, Check, Download, RotateCcw, Link2, Star, MessageCircle, Camera, Ghost, PartyPopper } from 'lucide-react';
import './styles.css';

const starter = {
  Bestie: [
    {q:'What would I pick for a perfect day?',a:['A spontaneous adventure','Snacks and a long yap','A cozy movie marathon','A little bit of everything'],correct:1},
    {q:'When I say “I’m fine”, what do I need?',a:['A detective investigation','Food. Immediately.','A little space','A hug and a meme'],correct:3},
    {q:'What is our friendship superpower?',a:['Reading each other’s mind','Laughing at nonsense','Showing up when it matters','All of the above'],correct:3},
    {q:'Who is most likely to make a random plan?',a:['Me, obviously','You, obviously','Both of us','We plan nothing and somehow go'],correct:2},
    {q:'Our friendship in one word?',a:['Chaotic','Wholesome','Iconic','Unbreakable'],correct:3}
  ],
  Couple: [
    {q:'What is my favourite kind of date?',a:['Fancy dinner','A tiny adventure','Staying in together','Anything, if it’s us'],correct:3},
    {q:'How do I like to be comforted?',a:['A long hug','A sweet message','A snack and a cuddle','Just stay close'],correct:3},
    {q:'What makes me feel most loved?',a:['Little thoughtful things','Quality time','Words that mean it','All the little things'],correct:3},
    {q:'Our dream mini escape?',a:['Mountains and sunsets','A beach at golden hour','A cute café crawl','Anywhere together'],correct:3},
    {q:'If we were a movie, we’d be…',a:['A rom-com','A comfort movie','A chaotic adventure','A forever kind of story'],correct:3}
  ]
};
const views = ['home','create','play','result'];
function readShared(){ try { const p=new URLSearchParams(location.search); const raw=p.get('quiz'); return raw?JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g,'+').replace(/_/g,'/'))))):null; } catch { return null; } }
function safeText(s=''){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&apos;'}[c]));}
function makeShare(quiz){ const json=JSON.stringify(quiz); return `${location.origin}${location.pathname}?quiz=${btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}`; }
function MascotBackdrop(){return <div className="mascot-world" aria-hidden="true"><div className="world-stars">✦　·　♡　·　✧　·　♡　·　✦</div><div className="cave cave-left"><span>♡</span></div><div className="cave cave-right"><span>✦</span></div><div className="runner runner-one"><svg viewBox="0 0 120 112"><ellipse cx="60" cy="101" rx="34" ry="7" fill="#b77a5d" opacity=".18"/><g className="run-body"><circle cx="34" cy="27" r="15" fill="#9b6548"/><circle cx="75" cy="26" r="15" fill="#9b6548"/><ellipse cx="56" cy="66" rx="31" ry="34" fill="#bd845e"/><circle cx="55" cy="42" r="36" fill="#d29a70"/><ellipse cx="55" cy="52" rx="22" ry="16" fill="#f5d9b5"/><ellipse cx="43" cy="39" rx="3.5" ry="5" fill="#48302a"/><ellipse cx="67" cy="39" rx="3.5" ry="5" fill="#48302a"/><path d="M50 49q5 5 10 0" fill="none" stroke="#654038" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="32" cy="52" rx="7" ry="4" fill="#f08d8b"/><ellipse cx="78" cy="52" rx="7" ry="4" fill="#f08d8b"/><path d="M40 82l-12 12m38-11 13 10" stroke="#9c684b" strokeWidth="10" strokeLinecap="round"/><path d="M46 96l-13 4m38-4 12 3" stroke="#7c5140" strokeWidth="8" strokeLinecap="round"/></g><path className="runner-heart" d="M91 12c-8-9-19 2 0 17 19-15 8-26 0-17Z" fill="#ef8586"/></svg></div><div className="runner runner-two"><svg viewBox="0 0 120 112"><ellipse cx="60" cy="101" rx="34" ry="7" fill="#b77a5d" opacity=".18"/><g className="run-body"><circle cx="34" cy="27" r="15" fill="#d9c8b7"/><circle cx="75" cy="26" r="15" fill="#d9c8b7"/><ellipse cx="56" cy="66" rx="31" ry="34" fill="#fff0d9"/><circle cx="55" cy="42" r="36" fill="#fff7e9"/><ellipse cx="55" cy="52" rx="22" ry="16" fill="#efd9c4"/><ellipse cx="43" cy="39" rx="3.5" ry="5" fill="#48302a"/><ellipse cx="67" cy="39" rx="3.5" ry="5" fill="#48302a"/><path d="M50 49q5 5 10 0" fill="none" stroke="#654038" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="32" cy="52" rx="7" ry="4" fill="#f6a2a0"/><ellipse cx="78" cy="52" rx="7" ry="4" fill="#f6a2a0"/><path d="M46 96l-13 4m38-4 12 3" stroke="#c9ad98" strokeWidth="8" strokeLinecap="round"/></g><path className="runner-heart" d="M91 12c-8-9-19 2 0 17 19-15 8-26 0-17Z" fill="#ef8586"/></svg></div><div className="world-caption">tiny paws, big feelings</div></div>}

function App(){
  const [view,setView]=useState('home'); const [history,setHistory]=useState(['home']);
  const [kind,setKind]=useState('Bestie'); const [title,setTitle]=useState('How well do you know me?');
  const [questions,setQuestions]=useState(starter.Bestie.map(x=>({...x,a:[...x.a]})));
  const [quiz,setQuiz]=useState(null); const [name,setName]=useState(''); const [started,setStarted]=useState(false); const [qIndex,setQIndex]=useState(0); const [answers,setAnswers]=useState([]); const [result,setResult]=useState(null); const [newQ,setNewQ]=useState(''); const [opts,setOpts]=useState(['','','','']); const [notice,setNotice]=useState('');
  const [shared, setShared] = useState(null);
  const [shortUrl, setShortUrl] = useState('');
   const shareText = () =>  `I scored ${result?.percent || 0}% on “${quiz?.title || title}” on MellowMates 💛`;
  const createShortUrl = async (data) => {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Could not save quiz');
  }

  const { id } = await response.json();

  if (!id) {
    throw new Error('Quiz ID missing');
  }

  return `${window.location.origin}/q/${encodeURIComponent(id)}`;
};

const share = async () => {
  try {
    const data = quiz || {
      kind,
      title,
      questions: questions.filter(
        x => x.q.trim() && x.a.every(y => y.trim())
      ).slice(0, 20)
    };

    const url = await createShortUrl(data);

    const message =
      `💛 I made a cute ${data.kind || 'Bestie'} quiz on MellowMates!\n\n` +
      `✨ "${data.title}"\n` +
      `🥹 Let's see how well you know me!\n\n` +
      `Take the quiz here 👇\n${url}`;

    if (navigator.share) {
      await navigator.share({
        title: `${data.title} 💛`,
        text: message,
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      setNotice('Quiz link copied! Send it to your favourite human 💌');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      setNotice('Could not create the link. Please try again 💛');
    }
  }
};

const copyLink = async () => {
  try {
    const data = quiz || {
      kind,
      title,
      questions: questions.filter(
        x => x.q.trim() && x.a.every(y => y.trim())
      ).slice(0, 20)
    };

    const url = await createShortUrl(data);
    await navigator.clipboard.writeText(url);
    setNotice('Short quiz link copied! 💌');
  } catch {
    setNotice('Could not copy the link. Please try again 💛');
  }
};

const openWhatsApp = async () => {
  try {
    const data = quiz || {
      kind,
      title,
      questions
    };

    const url = await createShortUrl(data);

    const message =
      `💛 I just tried "${data.title}" on MellowMates!\n\n` +
      `👀 Think you know me better? Your turn!\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  } catch {
    setNotice('Could not create the WhatsApp link. Please try again 💛');
  }
};
  const shareToApp=async(app)=>{const msg=shareText();try{if(navigator.share){await navigator.share({title:'My MellowMates score 💛',text:msg,url:makeShare(quiz||{kind,title,questions})});}else{await navigator.clipboard.writeText(msg);setNotice(`Score copied! Open ${app} and paste it into your story or chat ✨`);}}catch(e){if(e?.name!=='AbortError'){try{await navigator.clipboard.writeText(msg);setNotice(`Copied! Paste your score into ${app} 💌`);}catch{setNotice('Use the Copy score button to share your result.')}}}};

  useEffect(() => {
  const match = location.pathname.match(/^\/q\/([A-Za-z0-9_-]+)\/?$/);

  async function loadQuiz() {
    try {
      let data;

      if (match) {
        const response = await fetch(
          `/api/quiz?id=${encodeURIComponent(match[1])}`
        );

        if (!response.ok) throw new Error('Quiz not found');

        data = await response.json();
      } else {
        data = readShared();
      }

      if (data?.questions?.length) {
        setShared(data);
        setQuiz(data);
        setKind(data.kind || 'Bestie');
        setTitle(data.title || 'How well do you know me?');
        setView('play');
        setHistory(['home', 'play']);
      } else if (match) {
        setNotice('This quiz link is invalid or expired 💛');
      }
    } catch {
      setNotice('Could not load this quiz. Ask for a fresh link 💛');
    }
  }

  loadQuiz();
}, []);
  useEffect(()=>{ const onPop=()=>{ const route=(location.hash||'').replace('#',''); setView(views.includes(route)?route:(readShared()?'play':'home')); window.scrollTo({top:0,behavior:'smooth'}); }; window.addEventListener('popstate',onPop); return ()=>window.removeEventListener('popstate',onPop); },[]);
  const go=(v)=>{ setHistory(h=>[...h,v]); setView(v); window.history.pushState({view:v},'','#'+v); window.scrollTo({top:0,behavior:'smooth'}); };
  const back=()=>{ if(history.length>1){window.history.back();}else{setView('home');} };
  const startCreate=(k)=>{setKind(k);setTitle(k==='Bestie'?'How well do you know me?':'How well do you know your person?');setQuestions(starter[k].map(x=>({...x,a:[...x.a]})));go('create');};
  const addQuestion=()=>{if(!newQ.trim()||opts.some(x=>!x.trim())){setNotice('Add a question and all four answer options first 💛');return;}setQuestions(q=>[...q,{q:newQ.trim(),a:opts.map(x=>x.trim()),correct:0}]);setNewQ('');setOpts(['','','','']);setNotice('Question added! ✨');};
  const publish=()=>{const clean=questions.filter(x=>x.q.trim()&&x.a.every(y=>y.trim()));if(!title.trim()||!clean.length){setNotice('Give your quiz a title and at least one complete question.');return;}const data={kind,title:title.trim(),questions:clean.slice(0,20)};setQuiz(data);setName('');setStarted(false);setAnswers([]);setQIndex(0);setResult(null);go('play');};
  const beginShared=()=>{if(!name.trim()){setNotice('Type your name first, bestie 💛');return;}setNotice('');setStarted(true);setQIndex(0);setAnswers([]);setResult(null);};
  const choose=(i)=>{const next=[...answers,i];setAnswers(next);if(qIndex<quiz.questions.length-1)setQIndex(qIndex+1);else{const correct=next.reduce((n,a,idx)=>n+(a===quiz.questions[idx].correct?1:0),0);setResult({correct,total:quiz.questions.length,percent:Math.round(correct/quiz.questions.length*100)});go('result');}};
  const copyLink=()=>{const url=makeShare(quiz);navigator.clipboard?.writeText(url).then(()=>setNotice('Link copied! 💌')).catch(()=>setNotice(url));};
  const downloadCert=()=>{const pct=result?.percent||0;const label=pct>=80?'ULTIMATE FAVOURITE HUMAN':pct>=50?'CERTIFIED CUTIE':'OFFICIALLY ADORABLE';const person=safeText(name||'Your Favourite Human');const quizTitle=safeText(quiz?.title||title);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120"><defs><linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff9e8"/><stop offset=".52" stop-color="#ffe6d7"/><stop offset="1" stop-color="#ffefc5"/></linearGradient><linearGradient id="gold"><stop stop-color="#ffe59b"/><stop offset=".5" stop-color="#eeb74d"/><stop offset="1" stop-color="#c88a35"/></linearGradient><linearGradient id="coral"><stop stop-color="#ff9b91"/><stop offset="1" stop-color="#e45e79"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#8d5c46" flood-opacity=".18"/></filter></defs><rect width="1600" height="1120" rx="58" fill="url(#paper)"/><rect x="26" y="26" width="1548" height="1068" rx="44" fill="none" stroke="#d77e76" stroke-width="10"/><rect x="48" y="48" width="1504" height="1024" rx="34" fill="none" stroke="#e9b45c" stroke-width="3" stroke-dasharray="5 14"/><g fill="#ed7e85"><path d="M150 155c-35-37-75 7 0 63 75-56 35-100 0-63Z"/><path d="M1440 160c-27-29-58 6 0 49 58-43 27-78 0-49Z"/><path d="M150 930c-25-26-51 5 0 42 51-37 25-68 0-42Z"/><path d="M1430 930c-25-26-51 5 0 42 51-37 25-68 0-42Z"/></g><g fill="#dba343"><path d="M270 235l10 26 26 10-26 10-10 26-10-26-26-10 26-10z"/><path d="M1330 250l8 20 20 8-20 8-8 20-8-20-20-8 20-8z"/><circle cx="235" cy="770" r="8"/><circle cx="1360" cy="780" r="9"/></g><g filter="url(#shadow)"><rect x="610" y="88" width="380" height="68" rx="34" fill="#fffdf3" stroke="#f1c7a7" stroke-width="3"/><text x="800" y="130" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" letter-spacing="5" fill="#a76d5d">MELLOWMATES CLUB</text></g><text x="800" y="245" text-anchor="middle" font-family="Georgia,serif" font-size="82" font-weight="bold" fill="#553b36">Certificate of Cuteness</text><text x="800" y="305" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#9a7468">awarded with extra sprinkles to our very special</text><text x="800" y="410" text-anchor="middle" font-family="Georgia,serif" font-size="76" font-weight="bold" fill="#d15f79">${person}</text><path d="M430 440 Q800 480 1170 440" fill="none" stroke="#e8b65a" stroke-width="4" stroke-linecap="round"/><text x="800" y="510" text-anchor="middle" font-family="Arial,sans-serif" font-size="31" font-weight="bold" letter-spacing="3" fill="#a46d4e">${label}</text><text x="800" y="565" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#88675c">for completing</text><text x="800" y="610" text-anchor="middle" font-family="Georgia,serif" font-size="31" font-style="italic" fill="#b96e6f">“${quizTitle}”</text><g transform="translate(800 760)" filter="url(#shadow)"><circle r="116" fill="url(#gold)" stroke="#fff7d6" stroke-width="10"/><circle r="99" fill="none" stroke="#b77b30" stroke-width="3" stroke-dasharray="4 8"/><path d="M-32 10l-18 94 50-25 50 25-18-94" fill="url(#coral)" stroke="#fff0d8" stroke-width="5"/><circle r="72" fill="#fff7dc" stroke="#bd8134" stroke-width="5"/><text y="4" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="#bb7c34">${pct}%</text><text y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="bold" letter-spacing="2" fill="#a16b43">MATCH</text></g><g transform="translate(1220 680) scale(.7)" filter="url(#shadow)"><circle cx="-45" cy="-35" r="30" fill="#a86b48"/><circle cx="20" cy="-35" r="30" fill="#a86b48"/><ellipse cx="-12" cy="45" rx="67" ry="75" fill="#bd8258"/><circle cx="-12" cy="-20" r="64" fill="#c99165"/><ellipse cx="-12" cy="0" rx="38" ry="27" fill="#f2d2ad"/><circle cx="-30" cy="-28" r="6" fill="#422d28"/><circle cx="7" cy="-28" r="6" fill="#422d28"/><ellipse cx="-12" cy="-5" rx="7" ry="5" fill="#55332d"/><path d="M-12 2q-8 11-16 0m16 0q8 11 16 0" stroke="#55332d" stroke-width="3" stroke-linecap="round"/><ellipse cx="-49" cy="-2" rx="10" ry="6" fill="#f18d8d"/><ellipse cx="25" cy="-2" rx="10" ry="6" fill="#f18d8d"/><path d="M-12 38c-20-21-44 5 0 37 44-32 20-58 0-37Z" fill="#e86d80"/></g><g transform="translate(380 690) scale(.62)" filter="url(#shadow)"><circle cx="-45" cy="-35" r="30" fill="#ead5bf"/><circle cx="20" cy="-35" r="30" fill="#ead5bf"/><ellipse cx="-12" cy="45" rx="67" ry="75" fill="#fff0dc"/><circle cx="-12" cy="-20" r="64" fill="#fff7ea"/><ellipse cx="-12" cy="0" rx="38" ry="27" fill="#fffdf7"/><circle cx="-30" cy="-28" r="6" fill="#422d28"/><circle cx="7" cy="-28" r="6" fill="#422d28"/><ellipse cx="-12" cy="-5" rx="7" ry="5" fill="#d17a83"/><path d="M-12 2q-8 11-16 0m16 0q8 11 16 0" stroke="#795047" stroke-width="3" stroke-linecap="round"/><ellipse cx="-49" cy="-2" rx="10" ry="6" fill="#f4a0a0"/><ellipse cx="25" cy="-2" rx="10" ry="6" fill="#f4a0a0"/><path d="M-12 38c-20-21-44 5 0 37 44-32 20-58 0-37Z" fill="#e86d80"/></g><text x="800" y="970" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-style="italic" fill="#a66d5e">A tiny quiz. A big memory. A whole lot of love.</text><text x="800" y="1020" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" letter-spacing="4" fill="#bd8e6e">MADE WITH ♡ BY MELLOWMATES</text></svg>`;const svgBlob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});const svgUrl=URL.createObjectURL(svgBlob);const image=new Image();image.onload=async()=>{try{const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1120;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,1600,1120);const png=canvas.toDataURL('image/png');const { jsPDF }=await import('jspdf');const pdf=new jsPDF({orientation:'landscape',unit:'pt',format:[800,560],compress:true});pdf.addImage(png,'PNG',0,0,800,560,undefined,'FAST');pdf.save('mellowmates-certificate.pdf');setNotice('Your cute certificate PDF is downloading! 💛');}catch(err){setNotice('Could not create PDF. Please try again.');console.error(err);}finally{URL.revokeObjectURL(svgUrl);}};image.onerror=()=>{URL.revokeObjectURL(svgUrl);setNotice('Could not create certificate PDF. Please try again.');};image.src=svgUrl;};
  return <div className="app"><MascotBackdrop/><div className="ambient a1"/><div className="ambient a2"/><header className="topbar"><button className="brand" onClick={()=>{setView('home');setHistory(['home']);history.length>1&&window.history.pushState({},'','#home')}}><span className="brandmark"><Heart size={22} fill="currentColor"/></span><span>Mellow<span>Mates</span><small>little quizzes, big feelings</small></span></button><div className="topright"><span className="online"><i/> made for your people</span><button className="iconbtn" aria-label="Back" onClick={back}><ArrowLeft size={18}/></button></div></header>
  {view==='home'&&<main className="hero page"><section className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> YOUR PEOPLE, YOUR LITTLE QUIZ</div><h1>How well do they<br/> <em>really</em> know you?</h1><p className="lead">Make a tiny quiz for your bestie or your person. Share one link, collect their answers, and crown your favourite human. Cute chaos included.</p><div className="hero-actions"><button className="primary" onClick={()=>startCreate('Bestie')}>Make a quiz <ArrowRight size={18}/></button><button className="secondary" onClick={()=>startCreate('Couple')}>For my person <Heart size={17}/></button></div><div className="social-proof"><div className="mini-faces"><span>🐻</span><span>🐰</span><span>🧸</span></div><span><b>Besties, couples & chosen family</b><br/>one sweet link away</span></div></section><section className="hero-art"><div className="sunburst"/><div className="float-tag tag-one"><Heart size={14} fill="currentColor"/> bestie energy</div><div className="float-tag tag-two"><Sparkles size={14}/> 100% adorable</div><img className="scooter" src="/assets/mascot-duo.svg" alt="Two cute teddy friends riding a scooter"/><div className="speech-bubble">you + me<br/><b>always ♡</b></div><div className="hero-sticker">BFF<br/><Heart size={19} fill="currentColor"/></div></section><div className="feature-row"><div><span className="feature-icon yellow"><Users size={20}/></span><b>Bestie quizzes</b><small>Find your friendship twin</small></div><div><span className="feature-icon pink"><Heart size={20}/></span><b>Couple quizzes</b><small>For your favourite person</small></div><div><span className="feature-icon lilac"><Award size={20}/></span><b>Sweet certificates</b><small>Save the cute moment</small></div></div><section className="longdistance"><img src="/assets/mascot-duo.svg" alt="Two teddy friends connecting over a glowing heart"/><div><span className="eyebrow">EVEN FROM FAR AWAY</span><h2>Different places.<br/><em>Same little universe.</em></h2><p>Send your quiz across the miles and make someone’s day a little warmer.</p></div><img className="bunnies" src="/assets/mascot-duo.svg" alt="Two sweet bunny friends holding a heart"/></section></main>}
  {view==='create'&&<main className="page narrow"><button className="backlink" onClick={back}><ArrowLeft size={16}/> Back</button><div className="section-head"><div className="eyebrow"><Sparkles size={15}/> MAKE IT YOURS</div><h1>Build your <em>little quiz.</em></h1><p>Pick your vibe, add questions, then send the link to your person.</p></div><div className="kind-toggle"><button className={kind==='Bestie'?'active':''} onClick={()=>{setKind('Bestie');setQuestions(starter.Bestie.map(x=>({...x,a:[...x.a]})))}}>🐻 Bestie</button><button className={kind==='Couple'?'active':''} onClick={()=>{setKind('Couple');setQuestions(starter.Couple.map(x=>({...x,a:[...x.a]})))}}>💗 Couple</button></div><label className="field-label">Quiz title</label><input className="text-input" value={title} onChange={e=>setTitle(e.target.value)} maxLength={70} placeholder="How well do you know me?"/><div className="question-head"><div><h2>Your questions <span>{questions.length}/20</span></h2><p>Starter questions are ready to edit or remove.</p></div><span className="cute-badge">✦ made with love</span></div><div className="question-list">{questions.map((q,i)=><article className="question-card" key={i}><div className="q-top"><span className="q-number">{String(i+1).padStart(2,'0')}</span><input value={q.q} maxLength={180} onChange={e=>setQuestions(arr=>arr.map((x,j)=>j===i?{...x,q:e.target.value}:x))} aria-label={`Question ${i+1}`}/><button className="tiny-icon" onClick={()=>setQuestions(arr=>arr.filter((_,j)=>j!==i))} aria-label="Remove question"><Trash2 size={16}/></button></div><div className="option-grid">{q.a.map((a,j)=><input key={j} value={a} maxLength={90} onChange={e=>setQuestions(arr=>arr.map((x,k)=>k===i?{...x,a:x.a.map((v,n)=>n===j?e.target.value:v)}:x))} aria-label={`Option ${j+1} for question ${i+1}`}/>)}</div><div className="answer-note"><Star size={13}/> Correct answer for scoring: <select value={q.correct} onChange={e=>setQuestions(arr=>arr.map((x,j)=>j===i?{...x,correct:Number(e.target.value)}:x))}>{q.a.map((a,j)=><option value={j} key={j}>{String.fromCharCode(65+j)} · {a.slice(0,36)}</option>)}</select></div></article>)}</div>{questions.length<20&&<div className="add-card"><div className="add-title"><span className="add-icon"><Plus size={19}/></span><div><b>Add your own question</b><small>Make it personal. Make it funny.</small></div></div><input className="text-input" value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="Your question goes here…" maxLength={180}/><div className="option-grid">{opts.map((v,i)=><input key={i} value={v} onChange={e=>setOpts(arr=>arr.map((x,j)=>j===i?e.target.value:x))} placeholder={`Option ${String.fromCharCode(65+i)}`} maxLength={90}/>)}</div><button className="secondary full" onClick={addQuestion}><Plus size={16}/> Add question</button></div>}{notice&&<p className="notice">{notice}</p>}<button className="primary full publish" onClick={publish}>Preview & get my link <ArrowRight size={18}/></button><p className="tiny-note">Your link contains your quiz questions. No account needed to try the demo.</p></main>}
  {view==='play'&&<main className="page play-page"><div className="play-deco">♡</div><div className="play-card"><img src="/assets/mascot-duo.svg" alt="Cute bunnies" className="play-bunnies"/><div className="eyebrow"><Sparkles size={15}/> YOU’VE BEEN INVITED</div><h1>{quiz?.title||'How well do you know me?'}</h1><p className="play-sub">A little quiz made with love. Let’s see what you know. 💛</p>{!started?<div className="name-gate"><label className="field-label" htmlFor="playername">First, what should we call you?</label><input id="playername" className="text-input name-input" value={name} onChange={e=>{setName(e.target.value);setNotice('')}} onKeyDown={e=>{if(e.key==='Enter')e.preventDefault()}} placeholder="Your name…" maxLength={50} autoComplete="given-name"/><button className="primary full" onClick={beginShared}>I’m ready! <ArrowRight size={18}/></button><small>No rush — type your whole name, then tap the button ✨</small><div className="share-ready"><div><b>Quiz link is ready 💌</b><small>Send this quiz to your favourite human.</small></div><button className="secondary" onClick={copyLink}><Copy size={15}/> Copy link</button><button className="secondary share-icon" aria-label="Share quiz" onClick={share}><Share2 size={15}/></button></div></div>:<div className="quiz-question"><div className="progress-label"><span>QUESTION {qIndex+1} OF {quiz.questions.length}</span><span>{Math.round((qIndex/quiz.questions.length)*100)}%</span></div><div className="progress"><i style={{width:`${(qIndex/quiz.questions.length)*100}%`}}/></div><h2>{quiz.questions[qIndex].q}</h2><div className="answer-list">{quiz.questions[qIndex].a.map((a,i)=><button key={i} onClick={()=>choose(i)}><span>{String.fromCharCode(65+i)}</span>{a}<ArrowRight size={16}/></button>)}</div><button className="text-back" onClick={()=>{if(qIndex>0){setQIndex(qIndex-1);setAnswers(a=>a.slice(0,-1));}}} disabled={qIndex===0}><ArrowLeft size={14}/> Previous question</button></div>}{notice&&<p className="notice">{notice}</p>}</div><p className="powered">A little MellowMates moment <Heart size={13} fill="currentColor"/></p></main>}
  {view==='result'&&<main className="page result-page"><div className="result-card"><div className="confetti">✦　♡　✧　♡　✦</div><div className="eyebrow"><Award size={15}/> QUIZ COMPLETE</div><h1>You’re a certified<br/><em>favourite human.</em></h1><div className="score-ring"><strong>{result?.percent||0}%</strong><span>match</span></div><p className="result-copy">{result?.percent>=80?'Okay, you KNOW them. The lore is safe with you. 🥹':result?.percent>=50?'You know the important bits — and now you have more to talk about. 💛':'A few surprises left to discover. That’s the fun part. Go make another memory. ✨'}</p><div className="score-line"><span>{result?.correct||0} correct answers</span><span>{result?.total||0} questions</span></div><div className="result-actions"><button className="primary" onClick={downloadCert}><Download size={17}/> Download certificate</button><button className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(shareText());setNotice('Score copied! Paste it into your favourite chat 💌')}catch{setNotice(shareText())}}}><Copy size={16}/> Copy score</button></div><div className="result-share"><b>Show off your score ✨</b><div className="share-socials"><button onClick={openWhatsApp} className="social-whatsapp"><MessageCircle size={16}/> WhatsApp</button><button onClick={()=>shareToApp('Instagram')} className="social-instagram"><Camera size={16}/> Instagram</button><button onClick={()=>shareToApp('Snapchat')} className="social-snap"><Ghost size={16}/> Snapchat</button><button onClick={()=>shareToApp('your favourite app')} className="social-more"><Share2 size={16}/> More</button></div><small>Instagram & Snapchat open the phone’s share sheet where supported. You can also save your certificate and post it to your Story.</small>{notice&&<p className="notice">{notice}</p>}</div><button className="create-own" onClick={()=>{setResult(null);setQuiz(null);setName('');setStarted(false);startCreate('Bestie')}}><span className="create-own-icon"><PartyPopper size={22}/></span><span><b>Your turn to make one!</b><small>Create your own quiz and challenge your people</small></span><ArrowRight size={19}/></button><button className="text-back" onClick={()=>{setView('home');setHistory(['home']);setQuiz(null);setName('');setAnswers([]);}}><RotateCcw size={15}/> Back to MellowMates</button></div><div className="certificate-preview"><div className="cert-ribbon">✦ LITTLE MOMENT, BIG MEMORY ✦</div><div className="cert-heart">♥</div><span>CERTIFICATE OF CUTENESS</span><h2>{name||'Your favourite human'}</h2><p>has completed a MellowMates quiz with</p><b>{result?.percent||0}% match</b><div className="cert-seal"><Award size={25}/></div><small>certified adorable · MellowMates</small></div></main>}
  <footer><span>© MellowMates</span><span>Made for your people <Heart size={12} fill="currentColor"/></span><button onClick={()=>{setView('home');setHistory(['home'])}}>Home</button></footer></div>
}

createRoot(document.getElementById('root')).render(<App/>);
