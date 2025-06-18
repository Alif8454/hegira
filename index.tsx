/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import HegraApp from './HegraApp';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HegraApp />
    </React.StrictMode>
  );
} else {
  console.error("Root element 'root' not found in the DOM.");
}