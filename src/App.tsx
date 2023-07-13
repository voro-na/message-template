import React from 'react';
import {Link} from "react-router-dom";
import styles from './app.module.scss'

function App() {
  return (
    <div className={styles.container}>
      <Link to={'messageEditor'} className={styles.btn}>Message Editor</Link>
    </div>
  );
}

export default App;
