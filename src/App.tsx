export default function App() {
  return (
    <div style={{fontFamily:"Inter, system-ui, Arial", padding: 24}}>
      <h1>InstallSure — Final App Review</h1>
      <p>✅ This is a functional demo app wired to CI, E2E tests, security scans, and MCP config.</p>
      <ul>
        <li>Builds with <strong>Vite</strong></li>
        <li>Tested by <strong>Playwright</strong> (E2E)</li>
        <li>Scanned by <strong>CodeQL</strong> (JS/TS) and optional <strong>Bandit</strong> (Python)</li>
        <li>Dev Container ready</li>
        <li>Copilot Coding Agent MCP JSON included</li>
      </ul>
      <p>Try editing this page, commit, and push a PR to watch workflows pass.</p>
    </div>
  )
}
