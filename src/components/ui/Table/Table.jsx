import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Table.module.css';

function Table({ columns, data, onRowClick, emptyMessage }) {
  const { t } = useTranslation();
  const displayEmpty = emptyMessage || t('expenses.tableEmpty');
  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {columns.map((col) => (
                <th key={col.key} className={styles.headerCell} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {displayEmpty}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th key={col.key} className={styles.headerCell} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.reference || row.id || index}
              className={`${styles.bodyRow} ${onRowClick ? styles.clickable : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.bodyCell}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      width: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
};

export default Table;
