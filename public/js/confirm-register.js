class ConfirmRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      message: "",
    };
  }

  async componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      this.setState({
        status: "invalid",
        message: "Token de confirmação não encontrado na URL.",
      });
      return;
    }

    await this.confirmRegistration(token);
  }

  async confirmRegistration(token) {
    try {
      const response = await fetch("/user/confirm-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao confirmar registro");
      }

      this.setState({
        status: "success",
        message: data.message || "Seu cadastro foi confirmado com sucesso!",
      });
    } catch (error) {
      this.setState({
        status: "error",
        message:
          error.message || "Erro ao confirmar registro. Tente novamente.",
      });
    }
  }

  renderLoading() {
    return React.createElement(
      "div",
      { className: "spinner-container" },
      React.createElement("div", { className: "spinner" }),
      React.createElement(
        "p",
        { className: "loading-text" },
        "Confirmando seu registro...",
      ),
    );
  }

  renderSuccess() {
    return React.createElement(
      "div",
      null,
      React.createElement("div", { className: "status-icon success" }, "✓"),
      React.createElement(
        "h1",
        { className: "card-title" },
        "Registro Confirmado!",
      ),
      React.createElement("p", { className: "message" }, this.state.message),
      React.createElement(
        "a",
        { href: "/", className: "btn btn-primary" },
        "Ir para Login",
      ),
    );
  }

  renderError() {
    return React.createElement(
      "div",
      null,
      React.createElement("div", { className: "status-icon error" }, "✕"),
      React.createElement(
        "h1",
        { className: "card-title" },
        "Erro na Confirmação",
      ),
      React.createElement("p", { className: "message" }, this.state.message),
      React.createElement(
        "a",
        { href: "/", className: "btn btn-secondary" },
        "Voltar ao Login",
      ),
    );
  }

  renderInvalid() {
    return React.createElement(
      "div",
      null,
      React.createElement("div", { className: "status-icon error" }, "⚠"),
      React.createElement("h1", { className: "card-title" }, "Link Inválido"),
      React.createElement("p", { className: "message" }, this.state.message),
      React.createElement(
        "a",
        { href: "/", className: "btn btn-secondary" },
        "Voltar ao Login",
      ),
    );
  }

  render() {
    const { status } = this.state;

    let content;
    switch (status) {
      case "loading":
        content = this.renderLoading();
        break;
      case "success":
        content = this.renderSuccess();
        break;
      case "error":
        content = this.renderError();
        break;
      case "invalid":
        content = this.renderInvalid();
        break;
      default:
        content = this.renderLoading();
    }

    return React.createElement(
      "div",
      { className: "container" },
      React.createElement("div", { className: "card" }, content),
    );
  }
}

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ConfirmRegister));
