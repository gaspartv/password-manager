// Componente de Redefinir Senha
class ResetPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: null,
      success: null,
      fieldErrors: {},
      token: null,
      invalidToken: false,
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      this.setState({
        invalidToken: true,
        error: "Token de recuperação não encontrado na URL.",
      });
      return;
    }

    this.setState({ token });
  }

  validateForm = () => {
    const { password, confirmPassword } = this.state;
    const errors = {};

    if (!password) {
      errors.password = "A nova senha é obrigatória.";
    } else if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua nova senha.";
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
      const response = await fetch("/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.state.token,
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha");
      }

      this.setState({
        success: data.message || "Senha redefinida com sucesso!",
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao redefinir senha. Tente novamente.",
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

  renderInvalidToken() {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("div", { className: "status-icon error" }, "⚠"),
        React.createElement("h1", { className: "card-title" }, "Link Inválido"),
        React.createElement(
          "p",
          { className: "card-subtitle" },
          this.state.error,
        ),
        React.createElement(
          "a",
          {
            href: "/user/forgot-password",
            className: "btn btn-primary",
            style: { textDecoration: "none" },
          },
          "Solicitar novo link",
        ),
      ),
    );
  }

  renderSuccess() {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { className: "card-header" },
          React.createElement("div", { className: "status-icon success" }, "✓"),
          React.createElement(
            "h1",
            { className: "card-title" },
            "Senha Redefinida!",
          ),
          React.createElement(
            "p",
            { className: "card-subtitle" },
            this.state.success,
          ),
        ),
        React.createElement(
          "a",
          {
            href: "/",
            className: "btn btn-primary",
            style: { textDecoration: "none" },
          },
          "Ir para Login",
        ),
      ),
    );
  }

  render() {
    const {
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isLoading,
      error,
      success,
      fieldErrors,
      invalidToken,
    } = this.state;

    if (invalidToken) {
      return this.renderInvalidToken();
    }

    if (success) {
      return this.renderSuccess();
    }

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
          React.createElement("div", { className: "card-icon" }, "🔐"),
          React.createElement(
            "h1",
            { className: "card-title" },
            "Redefinir Senha",
          ),
          React.createElement(
            "p",
            { className: "card-subtitle" },
            "Digite sua nova senha abaixo.",
          ),
        ),

        // Alertas
        error &&
          React.createElement("div", { className: "alert alert-error" }, error),

        // Formulário
        React.createElement(
          "form",
          { onSubmit: this.handleSubmit },

          // Nova Senha
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "password" },
              "Nova Senha",
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

          // Confirmar Nova Senha
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { className: "form-label", htmlFor: "confirmPassword" },
              "Confirmar Nova Senha",
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
                    "Redefinindo...",
                  ),
                ]
              : "Redefinir Senha",
          ),
        ),

        // Footer
        React.createElement(
          "div",
          { className: "form-footer" },
          "Lembrou a senha? ",
          React.createElement(
            "a",
            { href: "/", className: "link" },
            "Fazer login",
          ),
        ),
      ),
    );
  }
}

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ResetPasswordForm));
