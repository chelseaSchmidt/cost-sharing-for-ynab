import { createRoot } from 'react-dom/client';
import Home from './components/Home';

const ROOT_NODE_ID = 'landing-page';

const rootNode = document.getElementById(ROOT_NODE_ID);

if (rootNode) {
  const root = createRoot(rootNode);
  root.render(<Home />);
}
