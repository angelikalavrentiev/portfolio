import { useEffect, useState } from "react";
import { login, getMe, logout, getProjects } from './apiFetch.js';

function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    getMe().then(setMe);
  }, []);


  return (
    <div>
      <h1>Dashboard Admin</h1>
    </div>
  );
}

export default Dashboard;
