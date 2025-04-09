import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister }) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Estado para erros de validação ou servidor
  const [errors, setErrors] = useState({});

  // Estado para controle de envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};

    // Validação do nome de usuário
    const usernameTrimmed = formData.username.trim();
    if (!usernameTrimmed) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (usernameTrimmed.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.username)) {
      newErrors.username = 'Use apenas letras e espaços';
    }

    // Validação do email
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para atualizar o estado ao digitar
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo ao começar a corrigir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Para se houver falha na validação
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Usuário registrado com sucesso!') {
        // Limpa o formulário e chama a função de sucesso
        setFormData({ username: '', email: '', password: '' });
        onRegister();
      } else {
        setErrors({ server: data.message || 'Erro ao registrar' });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErrors({ server: 'Erro ao conectar ao servidor. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Crie sua Conta</h2>

      {/* Exibe erro do servidor, se houver */}
      {errors.server && (
        <p className="register-error" role="alert">
          {errors.server}
        </p>
      )}

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        {/* Campo Nome de Usuário */}
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange('username')}
            placeholder="Digite seu nome de usuário"
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.username && (
            <span id="username-error" className="error-message" role="alert">
              {errors.username}
            </span>
          )}
        </div>

        {/* Campo Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Digite seu email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Campo Senha */}
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Digite sua senha"
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.password && (
            <span id="password-error" className="error-message" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="register-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;