// Componente de Registro de Usuário
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: null,
      success: null,
      fieldErrors: {},
    };
  }

  validateForm = () => {
    const { name, email, password, confirmPassword } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = "O nome é obrigatório.";
    } else if (name.trim().length < 3) {
      errors.name = "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!email.trim()) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de e-mail inválido.";
    }

    if (!password) {
      errors.password = "A senha é obrigatória.";
    } else if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    return errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = this.validateForm();
    if (Object.keys(fieldErrors).length > 0) {
      this.setState({ fieldErrors });
      return;
    }

    this.setState({
      isLoading: true,
      error: null,
      success: null,
      fieldErrors: {},
    });

    try {
      const response = await fetch("/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.name.trim(),
          email: this.state.email.trim(),
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      this.setState({
        success:
          data.message ||
          "Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.",
        isLoading: false,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao criar conta. Tente novamente.",
        isLoading: false,
      });
    }
  };

  togglePasswordVisibility = (field) => () => {
    this.setState((prevState) => ({
      [field]: !prevState[field],
    }));
  };

  handleInputChange = (field) => (e) => {
    this.setState({
      [field]: e.target.value,
      fieldErrors: { ...this.state.fieldErrors, [field]: null },
    });
  };

  renderPasswordIcon(show) {
    return React.createElement(
      "svg",
      {
        className: "icon",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      show
        ? React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
          })
        : [
            React.createElement("path", {
              key: "eye1",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
            }),
            React.createElement("path", {
              key: "eye2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            }),
          ],
    );
  }

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isLoading,
      error,
      success,
      fieldErrors,
    } = this.state;

    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "card" },
        // Header
        React.createElement(
          "div",
          { className: "card-header" },
          React.createElement(
            "h1",
            { className: "card-title" },
            "📝 Criar Conta",
          ),
          React.createElement(
            "p",
            { className: "card-subtitle" },
            "Preencha os dados abaixo para se cadastrar",
          ),
        ),

        // Alertas
        error &&
          React.createElement("div", { className: "alert alert-error" }, error),
        success &&
          React.createElement(
            "div",
            { className: "alert alert-success" },
            success,
          ),

        // Formulário
        React.createElement(
          "form",
          { onSubmit: this.handleSubmit },

          // Nome
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "name" },
              "Nome",
            ),
            React.createElement("input", {
              id: "name",
              type: "text",
              className: `form-input ${fieldErrors.name ? "error" : ""}`,
              placeholder: "Seu nome completo",
              value: name,
              onChange: this.handleInputChange("name"),
              disabled: isLoading,
            }),
            fieldErrors.name &&
              React.createElement(
                "p",
                { className: "form-error" },
                fieldErrors.name,
              ),
          ),

          // Email
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "email" },
              "E-mail",
            ),
            React.createElement("input", {
              id: "email",
              type: "email",
              className: `form-input ${fieldErrors.email ? "error" : ""}`,
              placeholder: "seu@email.com",
              value: email,
              onChange: this.handleInputChange("email"),
              disabled: isLoading,
            }),
            fieldErrors.email &&
              React.createElement(
                "p",
                { className: "form-error" },
                fieldErrors.email,
              ),
          ),

          // Senha
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "password" },
              "Senha",
            ),
            React.createElement(
              "div",
              { className: "password-wrapper" },
              React.createElement("input", {
                id: "password",
                type: showPassword ? "text" : "password",
                className: `form-input ${fieldErrors.password ? "error" : ""}`,
                placeholder: "••••••••",
                value: password,
                onChange: this.handleInputChange("password"),
                disabled: isLoading,
                style: { paddingRight: "2.5rem" },
              }),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "password-toggle",
                  onClick: this.togglePasswordVisibility("showPassword"),
                  "aria-label": showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha",
                },
                this.renderPasswordIcon(showPassword),
              ),
            ),
            fieldErrors.password &&
              React.createElement(
                "p",
                { className: "form-error" },
                fieldErrors.password,
              ),
          ),

          // Confirmar Senha
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "confirmPassword" },
              "Confirmar Senha",
            ),
            React.createElement(
              "div",
              { className: "password-wrapper" },
              React.createElement("input", {
                id: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                className: `form-input ${fieldErrors.confirmPassword ? "error" : ""}`,
                placeholder: "••••••••",
                value: confirmPassword,
                onChange: this.handleInputChange("confirmPassword"),
                disabled: isLoading,
                style: { paddingRight: "2.5rem" },
              }),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "password-toggle",
                  onClick: this.togglePasswordVisibility("showConfirmPassword"),
                  "aria-label": showConfirmPassword
                    ? "Ocultar senha"
                    : "Mostrar senha",
                },
                this.renderPasswordIcon(showConfirmPassword),
              ),
            ),
            fieldErrors.confirmPassword &&
              React.createElement(
                "p",
                { className: "form-error" },
                fieldErrors.confirmPassword,
              ),
          ),

          // Botão de submit
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn btn-primary",
              disabled: isLoading,
            },
            isLoading
              ? [
                  React.createElement("span", {
                    key: "spinner",
                    className: "spinner",
                  }),
                  React.createElement(
                    "span",
                    { key: "text" },
                    "Criando conta...",
                  ),
                ]
              : "Criar Conta",
          ),
        ),

        // Footer
        React.createElement(
          "div",
          { className: "form-footer" },
          "Já tem uma conta? ",
          React.createElement(
            "a",
            { href: "/auth", className: "link" },
            "Fazer login",
          ),
        ),
      ),
    );
  }
}

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(RegisterForm));
