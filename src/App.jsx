const { useMemo, useState } = React;

const typeNames = {
  module: '一级模块',
  stage: '二级阶段',
  aspect: '三级方面'
};

const stageStyles = {
  '施工前': 'bg-sky-50 text-sky-700 ring-sky-200',
  '施工中': 'bg-slate-100 text-slate-700 ring-slate-200',
  '异常处置': 'bg-red-50 text-red-700 ring-red-200',
  '复工复核': 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

function App() {
  const [path, setPath] = useState([]);
  const current = getNodeByPath(window.riskTree, path);
  const crumbs = useMemo(() => getCrumbs(window.riskTree, path), [path]);
  const stats = useMemo(() => collectStats(window.riskTree), []);

  function goTo(id) {
    setPath([...path, id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function jumpTo(index) {
    setPath(path.slice(0, index));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setPath(path.slice(0, -1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen">
      <TopBar stats={stats} />
      <section className="industrial-grid border-y border-white/70 bg-white/45">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:px-8">
          <Breadcrumbs crumbs={crumbs} onHome={() => setPath([])} onJump={jumpTo} />
          {path.length > 0 && <BackButton onClick={back} />}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
        {current.type === 'root' && <Home node={current} stats={stats} onOpen={goTo} />}
        {current.type !== 'root' && current.type !== 'aspect' && <NodePage node={current} onOpen={goTo} />}
        {current.type === 'aspect' && <AspectDetail node={current} />}
      </section>
    </main>
  );
}

function TopBar({ stats }) {
  return (
    <header className="border-b border-white/70 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="text-sm text-slate-300">智慧工地 · 风险分级管控</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">抽水蓄能电站风险管控处理演示系统</h1>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Metric label="一级模块" value={stats.modules} />
          <Metric label="管控阶段" value={stats.stages} />
          <Metric label="管控项" value={stats.aspects} danger />
        </div>
      </div>
    </header>
  );
}

function Metric({ label, value, danger }) {
  return (
    <div className="min-w-20 border-l border-white/15 px-4">
      <div className={danger ? 'text-2xl font-semibold text-red-300' : 'text-2xl font-semibold text-sky-200'}>{value}</div>
      <div className="mt-1 text-xs text-slate-300">{label}</div>
    </div>
  );
}

function Breadcrumbs({ crumbs, onHome, onJump }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <button onClick={onHome} className="rounded border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-400">首页</button>
      {crumbs.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="text-slate-400">/</span>
          <button onClick={() => onJump(index + 1)} className="rounded px-2 py-1 hover:bg-white">{item.title}</button>
        </React.Fragment>
      ))}
    </nav>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="w-fit rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-500">
      返回上一级
    </button>
  );
}

function Home({ node, stats, onOpen }) {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">风险总览</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">一级风险模块</h2>
        </div>
        <div className="rounded bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
          当前共 {stats.modules} 个风险模块，每个模块包含施工前、施工中、异常处置、复工复核四个阶段。
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {node.children.map((child, index) => (
          <ModuleCard key={child.id} node={child} index={index} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ node, index, onOpen }) {
  return (
    <button onClick={() => onOpen(node.id)} className="group min-h-48 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-slate-400">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">R{String(index + 1).padStart(2, '0')}</span>
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{countAspects(node)} 项管控</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-900">{node.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{node.summary}</p>
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {(node.children || []).map((stage) => (
          <span key={stage.id} className="h-1.5 rounded bg-slate-200 group-hover:bg-slate-700"></span>
        ))}
      </div>
    </button>
  );
}

function NodePage({ node, onOpen }) {
  const children = node.children || [];
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-400">{typeNames[node.type]}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-9 text-slate-900">{node.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{node.summary}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <PanelStat label="下级节点" value={children.length} />
          <PanelStat label="管控项" value={countAspects(node)} />
        </div>
      </aside>
      <div className="space-y-4">
        {children.map((child) => (
          <ListItem key={child.id} node={child} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function PanelStat({ label, value }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="text-xl font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function ListItem({ node, onOpen }) {
  const isStage = node.type === 'stage';
  return (
    <button onClick={() => onOpen(node.id)} className="group flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">{typeNames[node.type]}</span>
          {isStage && <StageBadge title={node.title} />}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{node.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{node.summary}</p>
      </div>
      <span className="shrink-0 rounded border border-slate-200 px-3 py-2 text-sm text-slate-600 group-hover:border-slate-500">查看</span>
    </button>
  );
}

function StageBadge({ title }) {
  return <span className={`rounded px-2.5 py-1 text-xs font-semibold ring-1 ${stageStyles[title] || stageStyles['施工中']}`}>{title}</span>;
}

function AspectDetail({ node }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{node.aspect}</span>
          <StageBadge title={node.stage} />
        </div>
        <h2 className="mt-4 text-3xl font-semibold leading-10 text-slate-950">{node.moduleTitle}</h2>
        <p className="mt-3 text-lg font-medium text-slate-700">{node.stage} · {node.aspect}</p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">管控内容</h3>
        <p className="mt-4 text-base leading-8 text-slate-700">{node.content}</p>
      </section>
    </div>
  );
}

function getNodeByPath(root, path) {
  return path.reduce((node, id) => (node.children || []).find((child) => child.id === id) || node, root);
}

function getCrumbs(root, path) {
  const crumbs = [];
  let node = root;
  path.forEach((id) => {
    node = (node.children || []).find((child) => child.id === id);
    if (node) crumbs.push(node);
  });
  return crumbs;
}

function countAspects(node) {
  if (node.type === 'aspect') return 1;
  return (node.children || []).reduce((sum, child) => sum + countAspects(child), 0);
}

function collectStats(root) {
  const all = [];
  walk(root, all);
  return {
    modules: all.filter((item) => item.type === 'module').length,
    stages: all.filter((item) => item.type === 'stage').length,
    aspects: all.filter((item) => item.type === 'aspect').length
  };
}

function walk(node, bucket) {
  bucket.push(node);
  (node.children || []).forEach((child) => walk(child, bucket));
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
