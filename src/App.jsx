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

const levelStyles = {
  '重大风险': 'bg-red-50 text-red-700 ring-red-200',
  '较大风险': 'bg-amber-50 text-amber-700 ring-amber-200',
  '一般风险': 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

function App() {
  const [path, setPath] = useState([]);
  const [query, setQuery] = useState('');
  const current = getNodeByPath(window.riskTree, path);
  const crumbs = useMemo(() => getCrumbs(window.riskTree, path), [path]);
  const stats = useMemo(() => collectStats(window.riskTree), []);
  const searchResults = useMemo(() => searchAspects(window.riskTree, query), [query]);

  function openPath(nextPath) {
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goTo(id) {
    openPath([...path, id]);
  }

  function jumpTo(index) {
    openPath(path.slice(0, index));
  }

  function back() {
    openPath(path.slice(0, -1));
  }

  return (
    <main className="min-h-screen">
      <TopBar stats={stats} />
      <section className="industrial-grid border-y border-white/70 bg-white/45">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:px-8">
          <Breadcrumbs crumbs={crumbs} onHome={() => openPath([])} onJump={jumpTo} />
          {path.length > 0 && <BackButton onClick={back} />}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
        {current.type === 'root' && (
          <Home
            node={current}
            stats={stats}
            query={query}
            onQuery={setQuery}
            searchResults={searchResults}
            onOpen={goTo}
            onOpenPath={openPath}
          />
        )}
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
          <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">抽水蓄能电站施工风险分析系统</h1>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <Metric label="风险模块" value={stats.modules} />
          <Metric label="重大风险" value={stats.major} danger />
          <Metric label="管控阶段" value={stats.stages} />
          <Metric label="措施项" value={stats.aspects} />
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

function Home({ node, stats, query, onQuery, searchResults, onOpen, onOpenPath }) {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">风险总览</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">十二类主要风险</h2>
        </div>
        <div className="rounded bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
          三级路径：风险类型 → 施工阶段 → 措施类别，当前收录 {stats.aspects} 项措施。
        </div>
      </div>
      <SearchPanel query={query} onQuery={onQuery} results={searchResults} onOpenPath={onOpenPath} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {node.children.map((child, index) => (
          <ModuleCard key={child.id} node={child} index={index} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function SearchPanel({ query, onQuery, results, onOpenPath }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">关键词检索</h3>
          <p className="mt-1 text-sm text-slate-500">输入盲炮、突水、吊装、有限空间、充排水、临时用电等关键词，系统反向定位措施。</p>
        </div>
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="输入关键词"
          className="h-11 w-full rounded border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-600 focus:bg-white md:w-80"
        />
      </div>
      {query.trim() && (
        <div className="mt-4 space-y-2">
          {results.length === 0 && <p className="text-sm text-slate-500">未找到匹配内容。</p>}
          {results.map((result) => (
            <button
              key={result.node.id}
              onClick={() => onOpenPath(result.path)}
              className="flex w-full flex-col rounded border border-slate-200 bg-slate-50 p-3 text-left hover:border-slate-400 hover:bg-white"
            >
              <span className="text-sm font-semibold text-slate-900">{result.node.moduleTitle}</span>
              <span className="mt-1 text-xs text-slate-500">{result.labels.join(' / ')}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ModuleCard({ node, index, onOpen }) {
  return (
    <button onClick={() => onOpen(node.id)} className="group min-h-52 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-slate-400">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400">R{String(index + 1).padStart(2, '0')}</span>
        <RiskLevelBadge level={node.riskLevel} />
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-900">{node.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{node.summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>{countAspects(node)} 项管控内容</span>
        <span>4 阶段 · 5 类措施</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
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
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-slate-400">{typeNames[node.type]}</p>
          {node.riskLevel && <RiskLevelBadge level={node.riskLevel} />}
          {node.type === 'stage' && <StageBadge title={node.title} />}
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-9 text-slate-900">{node.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{node.summary}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <PanelStat label="下级节点" value={children.length} />
          <PanelStat label="措施项" value={countAspects(node)} />
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
  return (
    <button onClick={() => onOpen(node.id)} className="group flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">{typeNames[node.type]}</span>
          {node.type === 'stage' && <StageBadge title={node.title} />}
          {node.riskLevel && <RiskLevelBadge level={node.riskLevel} />}
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

function RiskLevelBadge({ level }) {
  return <span className={`rounded px-2.5 py-1 text-xs font-semibold ring-1 ${levelStyles[level] || levelStyles['一般风险']}`}>{level}</span>;
}

function AspectDetail({ node }) {
  const [notice, setNotice] = useState('');
  const outputText = buildOutputText(node);

  function copyOutput() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(outputText).then(() => setNotice('已复制当前措施内容'));
    } else {
      setNotice('当前浏览器不支持自动复制');
    }
  }

  function exportOutput() {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.moduleTitle}-${node.stage}-${node.aspect}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('已生成文本文件');
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <RiskLevelBadge level={node.riskLevel} />
          <StageBadge title={node.stage} />
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{node.aspect}</span>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold leading-10 text-slate-950">{node.moduleTitle}</h2>
            <p className="mt-3 text-lg font-medium text-slate-700">{node.stage} · {node.aspect}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">复制措施</button>
            <button onClick={exportOutput} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">导出文本</button>
          </div>
        </div>
        {notice && <p className="mt-3 text-sm text-emerald-700">{notice}</p>}
      </div>

      {node.stage === '异常处置' && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
          <h3 className="text-base font-semibold">险情初期处置提示</h3>
          <p className="mt-2 text-sm leading-7">先停工、先撤人、先隔离、先报告，确认无二次伤害风险后再组织专业处置。</p>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-4">
        <MetaCard label="风险等级" value={node.riskLevel} />
        <MetaCard label="责任主体" value={node.responsible} />
        <MetaCard label="适用场景" value={node.scenarios} />
        <MetaCard label="输出用途" value="交底、检查、整改、复核" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">管控内容</h3>
        <p className="mt-4 text-base leading-8 text-slate-700">{node.content}</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">重点检查项</h3>
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {node.checkPoints.map((item) => (
            <li key={item} className="flex gap-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-600"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MetaCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-800">{value}</div>
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
    aspects: all.filter((item) => item.type === 'aspect').length,
    major: all.filter((item) => item.type === 'module' && item.riskLevel === '重大风险').length
  };
}

function searchAspects(root, query) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];
  const results = [];
  walkWithPath(root, [], [], (node, path, labels) => {
    if (node.type !== 'aspect') return;
    const text = [node.moduleTitle, node.stage, node.aspect, node.content, node.scenarios, node.responsible, ...(node.checkPoints || [])].join(' ').toLowerCase();
    if (text.includes(keyword)) {
      results.push({ node, path, labels });
    }
  });
  return results.slice(0, 8);
}

function walk(node, bucket) {
  bucket.push(node);
  (node.children || []).forEach((child) => walk(child, bucket));
}

function walkWithPath(node, path, labels, visitor) {
  visitor(node, path, labels);
  (node.children || []).forEach((child) => walkWithPath(child, [...path, child.id], [...labels, child.title], visitor));
}

function buildOutputText(node) {
  return [
    `风险类型：${node.moduleTitle}`,
    `风险等级：${node.riskLevel}`,
    `施工阶段：${node.stage}`,
    `措施类别：${node.aspect}`,
    `责任主体：${node.responsible}`,
    `适用场景：${node.scenarios}`,
    '',
    '管控内容：',
    node.content,
    '',
    '重点检查项：',
    ...node.checkPoints.map((item, index) => `${index + 1}. ${item}`)
  ].join('\n');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
