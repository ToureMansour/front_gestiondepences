import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "L'email est requis";
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="exemple@email.com"
          error={errors.email}
          required
        />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Votre mot de passe"
          error={errors.password}
          required
        />
        {error && (
          <p style={{ color: '#DC2626', fontSize: '13px', margin: 0, textAlign: 'center' }}>
            {error}
          </p>
        )}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;
