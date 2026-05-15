import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import RegionSelector from './RegionSelector';
import styles from './Navbar.module.css';

export default function MainSearch() {
  const [search, setSearch] = useState('');

  return (
    <form 
      className={styles.searchBar} 
      onSubmit={e => { 
        e.preventDefault(); 
        if (search.trim()) {
          window.location.href = `/productos?q=${encodeURIComponent(search)}`;
        }
      }}
    >
      <div className={styles.navRegionWrapper}>
        <RegionSelector />
      </div>
      
      <div className={styles.searchInputWrapper}>
        <SearchIcon size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Buscar productos, servicios, marcas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.searchBtn}>BUSCAR</button>
      <button type="submit" className={styles.searchBtnMobile}>
        <SearchIcon size={20} />
      </button>
    </form>
  );
}
