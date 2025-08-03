import { createRoot } from 'react-dom/client';
import App from './components/App';

const ROOT_NODE_ID = 'app';

const rootNode = document.getElementById(ROOT_NODE_ID);

if (rootNode) {
  const root = createRoot(rootNode);
  root.render(<App />);
}
