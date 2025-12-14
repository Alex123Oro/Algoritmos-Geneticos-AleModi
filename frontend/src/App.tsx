//import React from 'react';
import AdminApp from './admin/AdminApp';
import ClientApp from './client/ClientApp';

function App() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const isClient = view === 'cliente' || view === 'client';
  const Selected = isClient ? ClientApp : AdminApp;
  return <Selected />;
}

export default App;
