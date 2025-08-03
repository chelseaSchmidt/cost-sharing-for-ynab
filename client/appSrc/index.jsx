import React from 'react';
import { createRoot } from 'react-dom/client';
import CostSharingForYnab from './components/CostSharingForYnab';

const ROOT_NODE_ID = 'cost-sharing-for-ynab';

const rootNode = document.getElementById(ROOT_NODE_ID);

if (rootNode) {
  const root = createRoot(rootNode);
  root.render(<CostSharingForYnab />);
}
