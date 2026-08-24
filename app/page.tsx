'use client';

import { FormEvent, useMemo, useState } from 'react';

type Screen = 'home' | 'form' | 'result';
type Answers = { deathDate:string; relationship:string; will:string; realEstate:string; assets:string; debt:string; heirs:string; income:string; concern:string };

const initial: Answers = { deathDate:'2026-08-18', relationship:'父・母', will:'わからない', realEstate:'ある', assets:'ある', debt:'わからない', heirs:'いる', income:'年金と給与があった', concern:'何から手をつければよいか分からない' };
const questions = [
  ['relationship','亡くなった方との関係',['父・母','配偶者','兄弟姉妹','その他']],
  ['will','遺言書の有無',['ある','ない','わからない']],
  ['realEstate','不動産の有無',['ある','ない','わからない']],
  ['assets','預貯金・証券の有無',['ある','ない','わからない']],
  ['debt','借金・ローンの有無',['ある','ない','わからない']],
  ['heirs','他の相続人候補の有無',['いる','いない','わからない']],
] as const;

function dateLabel(value:string, add=0) { const d=new Date(`${value}T00:00:00`); if(Number.isNaN(d.getTime())) return '日付確認後に表示'; d.setMonth(d.getMonth()+add); return new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric'}).format(d); }

export default function Home() {
  const [screen,setScreen]=useState<Screen>('home'); const [answers,setAnswers]=useState<Answers>(initial); const [copied,setCopied]=useState(false);
  const days=useMemo(()=>Math.max(0,Math.floor((Date.now()-new Date(`${answers.deathDate}T00:00:00`).getTime())/86400000)),[answers.deathDate]);
  const go=(next:Screen)=>{setScreen(next);window.scrollTo({top:0,behavior:'smooth'})};
  const submit=(e:FormEvent)=>{e.preventDefault();go('result')};
  const memo=`相続 初期整理メモ\n死亡日：${dateLabel(answers.deathDate)}\n続柄：${answers.relationship}\n遺言書：${answers.will}\n不動産：${answers.realEstate}\n預貯金・証券：${answers.assets}\n借金・ローン：${answers.debt}\n他の相続人候補：${answers.heirs}\n亡くなった年の収入：${answers.income}\nいちばん困っていること：${answers.concern}`;
  const copy=async()=>{await navigator.clipboard.writeText(memo);setCopied(true);setTimeout(()=>setCopied(false),2000)};

  return <div className="app-shell">
    <header className="site-header"><button className="brand" onClick={()=>go('home')}><span className="brand-mark">結</span><span><b>おやすみ手続きナビ</b><small>相続の初期整理を、ひとつずつ。</small></span></button><span className="header-note">無料・登録不要</span></header>

    {screen==='home'&&<main>
      <section className="hero"><div><p className="eyebrow">大切な方を亡くされた直後のために</p><h1>今やることを、<br/><em>ひとつずつ。</em></h1><p className="lead">いくつかの質問に答えると、期限や必要なものを整理して、あなた専用の「最初の道しるべ」をつくります。</p><button className="primary" onClick={()=>go('form')}>状況を整理する <span>→</span></button><p className="privacy">✓ 入力内容は保存・送信されません　　約3分</p></div>
      <div className="hero-guide"><p>整理できること</p>{[['1','今日からやること','優先順位をつけて表示'],['2','手続きと期限','3か月・4か月・10か月の目安'],['3','窓口で見せるメモ','回答内容を1枚に集約']].map((x,i)=><div className="guide-wrap" key={x[0]}><div className="guide-step"><span>{x[0]}</span><div><b>{x[1]}</b><small>{x[2]}</small></div></div>{i<2&&<i/>}</div>)}</div></section>
      <section className="reassurance"><div><span>守</span><b>法律判断はしません</b><p>一般的な情報をもとに、整理と準備をお手伝いします。</p></div><div><span>人</span><b>ひとりで決めなくて大丈夫</b><p>専門家へ確認した方がよい場面も示します。</p></div><div><span>紙</span><b>あとで見返せます</b><p>結果は印刷・コピーできます。</p></div></section>
    </main>}

    {screen==='form'&&<main className="form-page"><div className="progress"><span>STEP 1 / 2</span><i/><b>状況を教えてください</b></div><div className="form-intro"><p className="eyebrow">分かる範囲で大丈夫です</p><h1>いまの状況を教えてください</h1><p>「わからない」も大切な回答です。あとから確認する項目として整理します。</p></div>
      <form onSubmit={submit}><section className="question important"><label htmlFor="death"><span>1</span><b>亡くなった日はいつですか？</b></label><input id="death" type="date" required value={answers.deathDate} onChange={e=>setAnswers({...answers,deathDate:e.target.value})}/><p>手続きの期限を計算するために使います。</p></section>
      <div className="question-grid">{questions.map((q,i)=><fieldset className="question" key={q[0]}><legend><span>{i+2}</span>{q[1]}</legend><div className="choices">{q[2].map(opt=><label key={opt}><input type="radio" name={q[0]} checked={answers[q[0]]===opt} onChange={()=>setAnswers({...answers,[q[0]]:opt})}/><span>{opt}</span></label>)}</div></fieldset>)}</div>
      <section className="question text-questions"><label htmlFor="income"><span>8</span><b>亡くなった年に、どのような収入がありましたか？</b></label><select id="income" value={answers.income} onChange={e=>setAnswers({...answers,income:e.target.value})}><option>年金のみ</option><option>給与のみ</option><option>年金と給与があった</option><option>事業・不動産収入があった</option><option>収入はなかった</option><option>わからない</option></select><label htmlFor="concern"><span>9</span><b>現在、いちばん困っていることは何ですか？</b></label><textarea id="concern" rows={3} value={answers.concern} onChange={e=>setAnswers({...answers,concern:e.target.value})}/></section>
      <div className="actions"><button type="button" className="text-button" onClick={()=>go('home')}>← 戻る</button><button className="primary">整理結果を見る <span>→</span></button></div></form></main>}

    {screen==='result'&&<main className="result-page">
      <section className="result-hero"><div><p className="eyebrow">あなたの現在地</p><h1>まずは、期限に関わる確認から。</h1><p>亡くなられてから <b>{days}日目</b> の想定です。すべてを一度に終わらせる必要はありません。</p></div><div className="status"><span>{days}</span><small>日目</small></div></section>
      {(answers.debt==='ある'||answers.debt==='わからない')&&<section className="alert"><span>!</span><div><p>先に確認した方がいいこと</p><h2>借金・ローンの全体像が分かるまで、財産を処分しないでください</h2><p>相続放棄を検討できる期間は、原則として「自分が相続人になったと知った時から3か月」です。迷う場合は、早めに家庭裁判所や専門家へ確認してください。</p></div></section>}
      <Block n="01" sub="最初の一歩" title="今日からやること"><div className="today"><label><input type="checkbox"/><span><b>遺言書がないか、保管場所を確認する</b><small>自宅・貸金庫・<HelpTerm label="公証役場" note="公正証書遺言を作成していた可能性がある場合は、最寄りの公証役場へ照会方法を確認します。公証役場は法務局とは別の窓口です。"/>・<OfficialLink href="https://www.moj.go.jp/MINJI/04">自筆証書遺言書保管制度</OfficialLink>を確認。封のある自筆証書遺言は勝手に開封しない。</small></span><em>今日</em></label>{[['通帳・郵便物・契約書を1か所に集める','まずは撮影やコピーで記録し、解約・名義変更は全体像を見てから。','今日'],['相続人になりそうな人を書き出す','配偶者、子、父母、兄弟姉妹など。戸籍での確認は次の段階で。','今週'],['借入先・カード・保証債務の手がかりを探す','請求書、メール、信用情報、確定申告書などを確認。','優先']].map(x=><label key={x[0]}><input type="checkbox"/><span><b>{x[0]}</b><small>{x[1]}</small></span><em>{x[2]}</em></label>)}</div></Block>
      <Block n="02" sub="見通しをつくる" title="手続きタイムライン"><div className="timeline"><Time when="いま" title="初期確認・資料集め">遺言書、相続人候補、財産と債務の手がかりを整理</Time><Time when={`3か月目安｜${dateLabel(answers.deathDate,3)}ごろ`} title={<OfficialLink href="https://www.courts.go.jp/saiban/syurui/syurui_kazi/kazi_06_13/index.html">相続放棄・限定承認の検討</OfficialLink>} warn>起算日は死亡日とは限りません。借金が不明なら早めに相談を。</Time><Time when={`4か月目安｜${dateLabel(answers.deathDate,4)}ごろ`} title={<OfficialLink href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm">準確定申告</OfficialLink>}>申告が必要な収入があった場合。税務署や税理士へ確認。</Time><Time when={`10か月目安｜${dateLabel(answers.deathDate,10)}ごろ`} title={<OfficialLink href="https://www.nta.go.jp/taxes/tetsuzuki/shinsei/shinkoku/sozoku/sozoku.htm">相続税の申告・納付</OfficialLink>}>遺産総額が基礎控除を超える場合などに必要。</Time>{answers.realEstate==='ある'&&<Time when="3年以内" title={<OfficialLink href="https://www.moj.go.jp/MINJI/minji05_00435">相続登記</OfficialLink>}>不動産を相続で取得したことを知った日から3年以内が原則。</Time>}</div></Block>
      <div className="two-col"><Block n="03" sub="まずは手元から" title="集めるもの"><ul className="paper"><li><b>戸籍</b><OfficialLink href="https://www.moj.go.jp/MINJI/minji04_00082.html">出生から死亡までの戸籍</OfficialLink></li><li><b>住所</b><HelpTerm label="住民票の除票・戸籍の附票" note="亡くなった方の最後の住所や住所履歴を確認する書類です。住民票の除票は最後の住所地、戸籍の附票は本籍地の市区町村へ請求します。"/></li><li><b>財産</b>通帳、残高通知、証券の書類</li>{answers.realEstate==='ある'&&<><li><b>不動産</b><HelpTerm label="固定資産税の納税通知書" note="通常は毎年、物件所在地の市区町村から納税義務者へ郵送されます。まず自宅や郵便物を確認し、見つからない場合は物件所在地の市区町村の固定資産税担当課へ相談してください。再発行できない自治体では、評価証明書など代わりの書類を案内されることがあります。"/>・<HelpTerm label="権利証" note="現在の名称は登記識別情報です。紛失しても相続登記ができなくなるわけではなく、通常の相続登記では提出を求められない場合があります。法務局へ必要書類を確認してください。"/></li><li><b>協議書</b><OfficialLink href="https://houmukyoku.moj.go.jp/homu/content/001392977.pdf">遺産分割協議書の記載例</OfficialLink></li></>}<li><b>債務</b>ローン・カード・保証の書類</li><li><b>収入</b><HelpTerm label="源泉徴収票・年金通知書" note="給与の源泉徴収票は勤務先へ、年金の源泉徴収票や支払通知書は年金の支払元へ再交付方法を確認します。"/></li></ul><p className="official-source-note">↗ 下線のある用語は、国の機関が運営する案内を開きます。点線の用語は、押すと入手方法が表示されます。</p></Block><Block n="04" sub="該当するか確認" title="公的制度"><div className="supports"><article><b><OfficialLink href="https://www.nenkin.go.jp/service/jukyu/seido/izokunenkin/jukyu-yoken/20150401-03.html">遺族年金</OfficialLink></b><p>加入状況や遺族の続柄・年齢などで対象が変わります。</p><span>日本年金機構の案内</span></article><article><b><HelpTerm label="葬祭費・埋葬料" note="亡くなった方が国民健康保険・後期高齢者医療なら市区町村、勤務先の健康保険なら加入していた健康保険へ申請先と期限を確認します。制度名や金額は保険者により異なります。"/></b><p>加入していた健康保険により給付制度があります。</p><span>市区町村・健康保険へ確認</span></article><article><b><OfficialLink href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/juuyou/kougakuiryou/index.html">高額療養費</OfficialLink></b><p>亡くなる前の医療費に未申請分がないか確認。</p><span>厚生労働省の案内</span></article></div></Block></div>
      <section className="split"><div><Heading n="05" sub="自分で進められる" title="整理・準備できる部分"/><ul className="checks"><li>関係者と連絡先の一覧をつくる</li><li>財産・債務を「分かる／不明」に分ける</li><li>書類を種類別に撮影・保管する</li><li>窓口へ聞きたいことをメモする</li></ul></div><div className="expert"><h3>専門家への確認を検討するポイント</h3><p><b>弁護士</b> 意見が合わない、借金や保証がある</p><p><b>司法書士</b> 不動産の名義変更を進めたい</p><p><b>税理士</b> 財産が多い、事業・不動産収入がある</p><small>※相談先は状況によって異なります。</small></div></section>
      <section className="memo"><div className="memo-top"><div><p className="eyebrow">窓口でそのまま見せられます</p><h2>状況整理メモ</h2></div><button onClick={copy}>{copied?'コピーしました ✓':'メモをコピー'}</button></div><div className="memo-grid">{[['死亡日',dateLabel(answers.deathDate)],['続柄',answers.relationship],['遺言書',answers.will],['不動産',answers.realEstate],['預貯金・証券',answers.assets],['借金・ローン',answers.debt],['他の相続人候補',answers.heirs],['亡くなった年の収入',answers.income]].map(x=><div key={x[0]}><small>{x[0]}</small><b>{x[1]}</b></div>)}<div className="wide"><small>いちばん困っていること</small><b>{answers.concern}</b></div></div></section>
      <div className="actions"><button className="text-button" onClick={()=>go('form')}>← 回答を修正する</button><button className="outline" onClick={()=>window.print()}>この結果を印刷する</button></div><aside className="disclaimer"><b>このサービスについて</b><p>表示内容は一般的な情報と入力内容に基づく整理例であり、法律・税務上の判断や個別の助言ではありません。期限の起算日や必要な手続きは状況により異なります。重要な判断の前に、公的窓口または専門家へ確認してください。</p></aside>
    </main>}
    <footer><b>おやすみ手続きナビ</b><p>大切なときに、迷わないための道しるべ。</p><small>© 2026 Prototype — 入力情報は保存されません</small></footer>
  </div>
}

function Heading({n,sub,title}:{n:string;sub:string;title:string}){return <div className="heading"><span>{n}</span><div><p>{sub}</p><h2>{title}</h2></div></div>}
function Block({n,sub,title,children}:{n:string;sub:string;title:string;children:React.ReactNode}){return <section className="block"><Heading n={n} sub={sub} title={title}/>{children}</section>}
function Time({when,title,warn,children}:{when:string;title:React.ReactNode;warn?:boolean;children:React.ReactNode}){return <div className={`time ${warn?'warn':''}`}><i/><time>{when}</time><div><b>{title}</b><p>{children}</p></div></div>}
function OfficialLink({href,children}:{href:string;children:React.ReactNode}){return <a className="official-link" href={href} target="_blank" rel="noreferrer" title="国の機関による案内を新しいタブで開く">{children}<span aria-hidden="true">↗</span></a>}
function HelpTerm({label,note}:{label:string;note:string}){return <details className="term-help"><summary>{label}<span aria-hidden="true">?</span></summary><div role="note"><b>{label}</b><p>{note}</p><small>用語をもう一度押すと閉じます。</small></div></details>}
