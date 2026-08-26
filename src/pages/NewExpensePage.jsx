import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import expenseService from '../features/expenses/services/expenseService';
import { useCategories } from '../features/categories/hooks/useCategories';
import { handleApiError } from '../services/errorHandler';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import styles from './NewExpensePage.module.css';

function NewExpensePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().slice(0, 10),
    category_id: '',
  });
  const { categories } = useCategories();
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setProof(file || null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setProof(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('amount', form.amount);
      payload.append('description', form.description || '');
      payload.append('expense_date', form.expense_date);
      if (form.category_id) payload.append('category_id', form.category_id);
      if (proof) payload.append('proof', proof);
      await expenseService.create(payload);
      showToast(t('toast.expenseCreated'));
      navigate('/expenses');
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/expenses')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          {t('expenses.backToExpenses')}
        </button>
        <h2 className={styles.title}>{t('expenses.newExpense')}</h2>
        <p className={styles.subtitle}>{t('expenses.submitted')}</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('expenses.titleCol')} *</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              value={form.title}
              onChange={handleChange}
              required
              placeholder={t('expenses.titlePlaceholder')}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t('expenses.amount')} *</label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>FCFA</span>
                <input
                  type="number"
                  name="amount"
                  className={styles.input}
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('expenses.date')} *</label>
              <input
                type="date"
                name="expense_date"
                className={styles.input}
                value={form.expense_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('categories.name')}</label>
            <select
              name="category_id"
              className={styles.input}
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">{t('categories.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('expenses.descriptionLabel')}</label>
            <textarea
              name="description"
              className={`${styles.input} ${styles.textarea}`}
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder={t('expenses.descriptionPlaceholder')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('expenses.proof')}</label>
            <div
              className={styles.dropzone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {proof ? (
                <div className={styles.fileInfo}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span className={styles.fileName}>{proof.name}</span>
                  <button type="button" className={styles.removeFile} onClick={() => setProof(null)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p className={styles.dropText}>
                    {t('expenses.uploadZone')}{' '}
                    <label className={styles.fileLabel}>
                      {t('expenses.importFile')}
                      <input type="file" className={styles.fileInput} onChange={handleFile} />
                    </label>
                  </p>
                </>
              )}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => navigate('/expenses')} disabled={loading}>
              {t('expenses.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.loading') : t('expenses.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewExpensePage;
