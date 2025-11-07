// Componente de Gerenciador de Senhas
class PasswordManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwords: [],
      isLoading: true,
      error: null,
      success: null,
      isAuthenticated: false,
      isModalOpen: false,
      formData: {
        name: "",
        login: "",
        password: "",
        url: "",
      },
      isSubmitting: false,
      visibleLogins: {}, // { [passwordId]: string }
      visiblePasswords: {}, // { [passwordId]: string }
      loadingLogins: {}, // { [passwordId]: boolean }
      loadingPasswords: {}, // { [passwordId]: boolean }
      searchTerm: "", // termo de busca
    };
    this.searchTimeout = null; // timeout para debounce
  }

  async componentDidMount() {
    // Verificar se tem token
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Redirecionar para login se não tiver token
      window.location.href = "/";
      return;
    }

    // Verificar se o token é válido e carregar passwords
    await this.loadPasswords(token);
  }

  componentWillUnmount() {
    // Limpar o timeout quando o componente for desmontado
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  async loadPasswords(token, search = "") {
    try {
      const url = search
        ? `/manager/passwords?search=${encodeURIComponent(search)}`
        : "/manager/passwords";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar senhas");
      }

      const data = await response.json();

      this.setState({
        passwords: data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao carregar senhas",
        isLoading: false,
      });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  handleRefresh = async () => {
    this.setState({ isLoading: true, error: null });
    const token = localStorage.getItem("access_token");
    const { searchTerm } = this.state;
    await this.loadPasswords(token, searchTerm);
  };

  handleSearch = (e) => {
    const searchTerm = e.target.value;

    // Atualiza o valor do input imediatamente (sem re-renderizar a lista)
    this.setState({ searchTerm });

    // Cancela o timeout anterior se existir
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Cria um novo timeout para fazer a busca após 500ms
    this.searchTimeout = setTimeout(async () => {
      this.setState({ isLoading: true });
      const token = localStorage.getItem("access_token");
      await this.loadPasswords(token, searchTerm);
    }, 2000);
  };

  handleViewPassword = async (id) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/manager/passwords/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar senha");
      }

      const data = await response.json();

      // Mostrar senha em um alert (pode ser melhorado com modal)
      alert(
        `Senha para ${data.name}:\n\nLogin: ${data.login}\nSenha: ${data.password}\nURL: ${data.url || "Não informada"}`,
      );
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao buscar senha",
      });
    }
  };

  handleToggleLogin = async (id) => {
    const { visibleLogins, loadingLogins } = this.state;

    // Se já está visível, ocultar
    if (visibleLogins[id]) {
      this.setState((prevState) => ({
        visibleLogins: {
          ...prevState.visibleLogins,
          [id]: null,
        },
      }));
      return;
    }

    // Marcar como loading
    this.setState((prevState) => ({
      loadingLogins: {
        ...prevState.loadingLogins,
        [id]: true,
      },
    }));

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/manager/passwords/${id}/login`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar login");
      }

      const data = await response.json();

      this.setState((prevState) => ({
        visibleLogins: {
          ...prevState.visibleLogins,
          [id]: data.login,
        },
        loadingLogins: {
          ...prevState.loadingLogins,
          [id]: false,
        },
      }));
    } catch (error) {
      this.setState((prevState) => ({
        error: error.message || "Erro ao buscar login",
        loadingLogins: {
          ...prevState.loadingLogins,
          [id]: false,
        },
      }));
    }
  };

  handleTogglePassword = async (id) => {
    const { visiblePasswords, loadingPasswords } = this.state;

    // Se já está visível, ocultar
    if (visiblePasswords[id]) {
      this.setState((prevState) => ({
        visiblePasswords: {
          ...prevState.visiblePasswords,
          [id]: null,
        },
      }));
      return;
    }

    // Marcar como loading
    this.setState((prevState) => ({
      loadingPasswords: {
        ...prevState.loadingPasswords,
        [id]: true,
      },
    }));

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/manager/passwords/${id}/password`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar senha");
      }

      const data = await response.json();

      this.setState((prevState) => ({
        visiblePasswords: {
          ...prevState.visiblePasswords,
          [id]: data.password,
        },
        loadingPasswords: {
          ...prevState.loadingPasswords,
          [id]: false,
        },
      }));
    } catch (error) {
      this.setState((prevState) => ({
        error: error.message || "Erro ao buscar senha",
        loadingPasswords: {
          ...prevState.loadingPasswords,
          [id]: false,
        },
      }));
    }
  };

  handleCopyLogin = async (id) => {
    const { visibleLogins } = this.state;

    // Se já está visível, copiar direto
    if (visibleLogins[id]) {
      try {
        await navigator.clipboard.writeText(visibleLogins[id]);
        this.setState({
          success: "Login copiado para a área de transferência!",
        });
        setTimeout(() => {
          this.setState({ success: null });
        }, 2000);
      } catch (error) {
        this.setState({
          error: "Erro ao copiar login",
        });
      }
      return;
    }

    // Se não está visível, buscar primeiro e depois copiar
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/manager/passwords/${id}/login`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar login");
      }

      const data = await response.json();

      await navigator.clipboard.writeText(data.login);

      this.setState({
        success: "Login copiado para a área de transferência!",
      });

      setTimeout(() => {
        this.setState({ success: null });
      }, 2000);
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao copiar login",
      });
    }
  };

  handleCopyPassword = async (id) => {
    const { visiblePasswords } = this.state;

    // Se já está visível, copiar direto
    if (visiblePasswords[id]) {
      try {
        await navigator.clipboard.writeText(visiblePasswords[id]);
        this.setState({
          success: "Senha copiada para a área de transferência!",
        });
        setTimeout(() => {
          this.setState({ success: null });
        }, 2000);
      } catch (error) {
        this.setState({
          error: "Erro ao copiar senha",
        });
      }
      return;
    }

    // Se não está visível, buscar primeiro e depois copiar
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/manager/passwords/${id}/password`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar senha");
      }

      const data = await response.json();

      await navigator.clipboard.writeText(data.password);

      this.setState({
        success: "Senha copiada para a área de transferência!",
      });

      setTimeout(() => {
        this.setState({ success: null });
      }, 2000);
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao copiar senha",
      });
    }
  };

  handleOpenModal = () => {
    this.setState({ isModalOpen: true, error: null, success: null });
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
      formData: {
        name: "",
        login: "",
        password: "",
        url: "",
      },
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = this.state;
    const token = localStorage.getItem("access_token");

    // Validação básica
    if (!formData.name || !formData.login || !formData.password) {
      this.setState({
        error: "Nome, login e senha são obrigatórios",
      });
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    try {
      const response = await fetch("/manager/passwords", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar senha");
      }

      const newPassword = await response.json();

      this.setState((prevState) => ({
        passwords: [...prevState.passwords, newPassword],
        success: "Senha criada com sucesso!",
        isSubmitting: false,
        isModalOpen: false,
        formData: {
          name: "",
          login: "",
          password: "",
          url: "",
        },
      }));

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.setState({ success: null });
      }, 3000);
    } catch (error) {
      this.setState({
        error: error.message || "Erro ao criar senha",
        isSubmitting: false,
      });
    }
  };

  renderLoading() {
    return React.createElement(
      "div",
      { className: "card" },
      React.createElement(
        "div",
        { className: "loading-container" },
        React.createElement("div", { className: "spinner" }),
        React.createElement(
          "p",
          { className: "loading-text" },
          "Carregando suas senhas...",
        ),
      ),
    );
  }

  renderEmptyState() {
    const { searchTerm } = this.state;

    if (searchTerm) {
      // Mensagem quando há busca ativa mas sem resultados
      return React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { className: "empty-state" },
          React.createElement("div", { className: "empty-state-icon" }, "🔍"),
          React.createElement(
            "h2",
            { className: "empty-state-title" },
            "Nenhum resultado encontrado",
          ),
        ),
      );
    }

    // Mensagem quando não há senhas cadastradas
    return React.createElement(
      "div",
      { className: "card" },
      React.createElement(
        "div",
        { className: "empty-state" },
        React.createElement("div", { className: "empty-state-icon" }, "🔐"),
      ),
    );
  }

  renderTable() {
    const {
      passwords,
      visibleLogins,
      visiblePasswords,
      loadingLogins,
      loadingPasswords,
    } = this.state;

    return React.createElement(
      "div",
      { className: "card" },
      React.createElement(
        "div",
        { className: "table-container" },
        React.createElement(
          "table",
          { className: "table" },
          // Header
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "Nome"),
              React.createElement("th", null, "Login"),
              React.createElement("th", null, "Senha"),
              React.createElement("th", null, "URL"),
            ),
          ),
          // Body
          React.createElement(
            "tbody",
            null,
            passwords.map((password) =>
              React.createElement(
                "tr",
                { key: password.id },
                // Nome
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      },
                    },
                    React.createElement(
                      "svg",
                      {
                        className: "icon",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                      },
                      React.createElement("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
                      }),
                    ),
                    React.createElement("strong", null, password.name),
                  ),
                ),
                // Login
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      },
                    },
                    React.createElement(
                      "span",
                      { className: "password-field" },
                      visibleLogins[password.id] || "*******",
                    ),
                    React.createElement(
                      "button",
                      {
                        className: "btn-icon-toggle",
                        onClick: () => this.handleToggleLogin(password.id),
                        disabled: loadingLogins[password.id],
                        title: visibleLogins[password.id]
                          ? "Ocultar login"
                          : "Mostrar login",
                      },
                      loadingLogins[password.id]
                        ? React.createElement("div", {
                            className: "spinner-sm",
                          })
                        : React.createElement(
                            "svg",
                            {
                              className: "icon-sm",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            visibleLogins[password.id]
                              ? React.createElement("path", {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                  d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.87 6.87m12.122 12.122l-2.131-2.132m2.131 2.132l2.121-2.121",
                                })
                              : [
                                  React.createElement("path", {
                                    key: "1",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                                  }),
                                  React.createElement("path", {
                                    key: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                                  }),
                                ],
                          ),
                    ),
                    React.createElement(
                      "button",
                      {
                        className: "btn-icon-copy",
                        onClick: () => this.handleCopyLogin(password.id),
                        title: "Copiar login",
                      },
                      React.createElement(
                        "svg",
                        {
                          className: "icon-sm",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                        },
                        React.createElement("path", {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
                        }),
                      ),
                    ),
                  ),
                ),
                // Senha
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      },
                    },
                    React.createElement(
                      "span",
                      { className: "password-field" },
                      visiblePasswords[password.id] || "*******",
                    ),
                    React.createElement(
                      "button",
                      {
                        className: "btn-icon-toggle",
                        onClick: () => this.handleTogglePassword(password.id),
                        disabled: loadingPasswords[password.id],
                        title: visiblePasswords[password.id]
                          ? "Ocultar senha"
                          : "Mostrar senha",
                      },
                      loadingPasswords[password.id]
                        ? React.createElement("div", {
                            className: "spinner-sm",
                          })
                        : React.createElement(
                            "svg",
                            {
                              className: "icon-sm",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24",
                            },
                            visiblePasswords[password.id]
                              ? React.createElement("path", {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                  d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.87 6.87m12.122 12.122l-2.131-2.132m2.131 2.132l2.121-2.121",
                                })
                              : [
                                  React.createElement("path", {
                                    key: "1",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                                  }),
                                  React.createElement("path", {
                                    key: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                                  }),
                                ],
                          ),
                    ),
                    React.createElement(
                      "button",
                      {
                        className: "btn-icon-copy",
                        onClick: () => this.handleCopyPassword(password.id),
                        title: "Copiar senha",
                      },
                      React.createElement(
                        "svg",
                        {
                          className: "icon-sm",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                        },
                        React.createElement("path", {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
                        }),
                      ),
                    ),
                  ),
                ),
                // URL
                React.createElement(
                  "td",
                  null,
                  password.url
                    ? React.createElement(
                        "a",
                        {
                          href: password.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "link",
                        },
                        password.url,
                        React.createElement(
                          "svg",
                          {
                            className: "icon-sm",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                          },
                          React.createElement("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
                          }),
                        ),
                      )
                    : React.createElement(
                        "span",
                        {
                          style: { color: "var(--chakra-colors-gray-500)" },
                        },
                        "Não informada",
                      ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  renderModal() {
    const { isModalOpen, formData, isSubmitting, error } = this.state;

    if (!isModalOpen) return null;

    return React.createElement(
      "div",
      { className: "modal-overlay", onClick: this.handleCloseModal },
      React.createElement(
        "div",
        {
          className: "modal-content",
          onClick: (e) => e.stopPropagation(),
        },
        // Body do Modal
        React.createElement(
          "form",
          { onSubmit: this.handleSubmit },
          React.createElement(
            "div",
            { className: "modal-body" },
            // Campo Nome
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { htmlFor: "name", className: "form-label" },
                "Nome *",
              ),
              React.createElement("input", {
                type: "text",
                id: "name",
                name: "name",
                className: "form-input",
                placeholder: "Ex: Gmail, Facebook, etc.",
                value: formData.name,
                onChange: this.handleInputChange,
                required: true,
                disabled: isSubmitting,
              }),
            ),

            // Campo Login
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { htmlFor: "login", className: "form-label" },
                "Login *",
              ),
              React.createElement("input", {
                type: "text",
                id: "login",
                name: "login",
                className: "form-input",
                placeholder: "seu@email.com ou usuário",
                value: formData.login,
                onChange: this.handleInputChange,
                required: true,
                disabled: isSubmitting,
              }),
            ),

            // Campo Senha
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { htmlFor: "password", className: "form-label" },
                "Senha *",
              ),
              React.createElement("input", {
                type: "password",
                id: "password",
                name: "password",
                className: "form-input",
                placeholder: "Digite a senha",
                value: formData.password,
                onChange: this.handleInputChange,
                required: true,
                disabled: isSubmitting,
              }),
            ),

            // Campo URL (opcional)
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { htmlFor: "url", className: "form-label" },
                "URL (opcional)",
              ),
              React.createElement("input", {
                type: "url",
                id: "url",
                name: "url",
                className: "form-input",
                placeholder: "https://exemplo.com",
                value: formData.url,
                onChange: this.handleInputChange,
                disabled: isSubmitting,
              }),
            ),

            // Mensagem de erro no modal
            error &&
              React.createElement(
                "div",
                {
                  className: "alert alert-error",
                  style: { marginTop: "1rem" },
                },
                React.createElement(
                  "svg",
                  {
                    className: "icon",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                  },
                  React.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  }),
                ),
                error,
              ),
          ),

          // Footer do Modal
          React.createElement(
            "div",
            { className: "modal-footer" },
            React.createElement(
              "button",
              {
                type: "button",
                className: "btn btn-secondary",
                onClick: this.handleCloseModal,
                disabled: isSubmitting,
              },
              "Cancelar",
            ),
            React.createElement(
              "button",
              {
                type: "submit",
                className: "btn btn-primary",
                disabled: isSubmitting,
              },
              isSubmitting ? "Salvando..." : "Salvar Senha",
            ),
          ),
        ),
      ),
    );
  }

  render() {
    const { isLoading, error, success, passwords, searchTerm } = this.state;

    return React.createElement(
      "div",
      { className: "container" },
      // Header
      React.createElement(
        "header",
        { className: "header" },
        React.createElement(
          "div",
          { className: "header-title" },
          React.createElement("h1", null, "🔐"),
        ),
        React.createElement(
          "div",
          { className: "header-actions" },
          React.createElement(
            "button",
            {
              className: "btn btn-primary",
              onClick: this.handleOpenModal,
              disabled: isLoading,
            },
            React.createElement(
              "svg",
              {
                className: "icon",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 4v16m8-8H4",
              }),
            ),
          ),
          React.createElement(
            "button",
            {
              className: "btn btn-danger",
              onClick: this.handleLogout,
            },
            React.createElement(
              "svg",
              {
                className: "icon",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
              },
              React.createElement("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
              }),
            ),
          ),
        ),
      ),

      // Campo de Busca
      React.createElement(
        "div",
        { className: "search-container" },
        React.createElement(
          "div",
          { className: "search-input-wrapper" },
          React.createElement(
            "svg",
            {
              className: "search-icon",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
            },
            React.createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            }),
          ),
          React.createElement("input", {
            type: "text",
            className: "search-input",
            placeholder: "Buscar...",
            value: searchTerm,
            onChange: this.handleSearch,
            disabled: isLoading,
          }),
          searchTerm &&
            React.createElement(
              "button",
              {
                className: "search-clear-btn",
                onClick: () => {
                  this.setState({ searchTerm: "" });
                  const token = localStorage.getItem("access_token");
                  this.loadPasswords(token, "");
                },
                title: "Limpar busca",
              },
              React.createElement(
                "svg",
                {
                  className: "icon-sm",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                },
                React.createElement("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12",
                }),
              ),
            ),
        ),
      ),

      // Alertas
      error &&
        React.createElement(
          "div",
          { className: "alert alert-error" },
          React.createElement(
            "svg",
            {
              className: "icon",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
            },
            React.createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            }),
          ),
          error,
        ),

      success &&
        React.createElement(
          "div",
          { className: "alert alert-success" },
          React.createElement(
            "svg",
            {
              className: "icon",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
            },
            React.createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            }),
          ),
          success,
        ),

      // Conteúdo
      isLoading
        ? this.renderLoading()
        : passwords.length === 0
          ? this.renderEmptyState()
          : this.renderTable(),

      // Modal
      this.renderModal(),
    );
  }
}

// Renderizar o componente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(PasswordManager));
