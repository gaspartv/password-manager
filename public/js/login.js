// Componente de Login
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
      error: null,
      success: null,
    };
  }

  async componentDidMount() {
    // Verificar se já tem um token válido
    const token = localStorage.getItem("access_token");

    if (token) {
      // Tentar validar o token fazendo uma chamada à API
      try {
        const response = await fetch("/manager/passwords", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Se o token for válido (status 200), redirecionar para a página de senhas
        if (response.ok) {
          window.location.href = "/manager";
          return;
        }

        // Se o token for inválido (401), removê-lo
        if (response.status === 401) {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        // Em caso de erro na requisição, remover o token
        localStorage.removeItem("access_token");
      }
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null, success: null });

    try {
      const response = await fetch("/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Salvar token no localStorage
      localStorage.setItem("access_token", data.access_token);

      this.setState({
        success: "Login realizado com sucesso! Redirecionando...",
        isLoading: false,
      });

      // Redirecionar após 1.5 segundos para a página de senhas
      setTimeout(() => {
        window.location.href = "/manager";
      }, 1500);
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao fazer login. Tente novamente.",
        isLoading: false,
      });
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleInputChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  render() {
    const { email, password, showPassword, isLoading, error, success } =
      this.state;

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
          React.createElement("h1", { className: "card-title" }, "🔐"),
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
          // Email
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("input", {
              id: "email",
              type: "email",
              className: "form-input",
              placeholder: "Login",
              value: email,
              onChange: this.handleInputChange("email"),
              required: true,
              disabled: isLoading,
            }),
          ),

          // Senha
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "div",
              { className: "password-wrapper" },
              React.createElement("input", {
                id: "password",
                type: showPassword ? "text" : "password",
                className: "form-input",
                placeholder: "••••••••",
                value: password,
                onChange: this.handleInputChange("password"),
                required: true,
                disabled: isLoading,
                style: { paddingRight: "2.5rem" },
              }),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "password-toggle",
                  onClick: this.togglePasswordVisibility,
                  "aria-label": showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha",
                },
                React.createElement(
                  "svg",
                  {
                    className: "icon",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                  },
                  showPassword
                    ? React.createElement("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
                      })
                    : React.createElement("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                      }),
                  !showPassword &&
                    React.createElement("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                    }),
                ),
              ),
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
                  React.createElement("span", { key: "text" }, "Entrando..."),
                ]
              : "Acessar",
          ),

          // Link esqueci senha
          React.createElement(
            "div",
            { className: "form-footer", style: { marginTop: "1rem" } },
            React.createElement(
              "a",
              { href: "/user/forgot-password", className: "link" },
              "Esqueci minha senha",
            ),
          ),
        ),

        // Footer - Link para registro
        React.createElement(
          "div",
          { className: "form-footer" },
          "Não tem uma conta? ",
          React.createElement(
            "a",
            { href: "/user/register", className: "link" },
            "Criar conta",
          ),
        ),
      ),
    );
  }
}

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(LoginForm));
