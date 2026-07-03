import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import PageHeader from '../components/shared/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/hooks/useAuth';

function ProfilePage() {
  const { user } = useAuthStore();
  const { updateProfile, loading, error } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(form);
    if (result) setSuccess(true);
  };

  return (
    <div>
      <PageHeader title={t('profile.title')} description={t('profile.description')} />
      <div style={{ maxWidth: '480px' }}>
        <Card>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: '#0F766E',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '8px',
              }}>
                {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
              </div>
              <Input
                label={t('profile.name')}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label={t('profile.email')}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {error && (
                <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
              )}
              {success && (
                <p style={{ color: '#059669', fontSize: '13px', margin: 0, fontWeight: 500 }}>
                  {t('profile.success')}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? t('profile.saving') : t('profile.save')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
