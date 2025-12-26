// Componente de Esqueci Minha Senha
class ForgotPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isLoading: false,
      error: null,
      success: null,
      fieldErrors: {},
    };
  }

  validateForm = () => {
    const { email } = this.state;
    const errors = {};

    if (!email.trim()) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de e-mail inválido.";
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
      const response = await fetch("/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao solicitar recuperação de senha",
        );
      }

      this.setState({
        success:
          data.message ||
          "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
        isLoading: false,
        email: "",
      });
    } catch (error) {
      this.setState({
        error:
          error.message ||
          "Erro ao solicitar recuperação de senha. Tente novamente.",
        isLoading: false,
      });
    }
  };

  handleInputChange = (field) => (e) => {
    this.setState({
      [field]: e.target.value,
      fieldErrors: { ...this.state.fieldErrors, [field]: null },
    });
  };

  render() {
    const { email, isLoading, error, success, fieldErrors } = this.state;

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
          React.createElement("div", { className: "card-icon" }, "🔑"),
          React.createElement(
            "h1",
            { className: "card-title" },
            "Esqueceu sua senha?",
          ),
          React.createElement(
            "p",
            { className: "card-subtitle" },
            "Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.",
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
        !success &&
          React.createElement(
            "form",
            { onSubmit: this.handleSubmit },

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
                    React.createElement("span", { key: "text" }, "Enviando..."),
                  ]
                : "Enviar Link de Recuperação",
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
root.render(React.createElement(ForgotPasswordForm));
