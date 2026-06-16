document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Usuário
    // =========================
    const nomeUsuario =
        localStorage.getItem("usuarioLogado") || "Usuário";

    const welcomeUserName =
        document.getElementById("welcomeUserName");

    if (welcomeUserName) {
        welcomeUserName.textContent = nomeUsuario;
    }

    // =========================
    // Data atual
    // =========================
    let dataSelecionada = new Date();

    const textFullDate =
        document.getElementById("textFullDate");

    function atualizarDataCompleta() {
        if (!textFullDate) return;

        textFullDate.textContent =
            dataSelecionada.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
    }

    atualizarDataCompleta();

    // =========================
    // Semana
    // =========================
    const weekContainer =
        document.getElementById("weekContainer");

    const diasSemana = [
        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"
    ];

    function gerarSemana() {

        if (!weekContainer) return;

        weekContainer.innerHTML = "";

        let inicioSemana = new Date(dataSelecionada);

        inicioSemana.setDate(
            inicioSemana.getDate() -
            inicioSemana.getDay()
        );

        for (let i = 0; i < 7; i++) {

            const dia = new Date(inicioSemana);

            dia.setDate(
                inicioSemana.getDate() + i
            );

            const card =
                document.createElement("div");

            card.className = "week-day-card";

            if (
                dia.toDateString() ===
                dataSelecionada.toDateString()
            ) {
                card.classList.add("active");
            }

            card.innerHTML = `
                <small>${diasSemana[dia.getDay()]}</small>
                <h3>${dia.getDate()}</h3>
            `;

            card.addEventListener("click", () => {
                dataSelecionada = dia;
                atualizarDataCompleta();
                gerarSemana();
                atualizarBanner();
            });

            weekContainer.appendChild(card);
        }
    }

    gerarSemana();

    // =========================
    // Banner
    // =========================
    const bannerText =
        document.getElementById("bannerText");

    function atualizarBanner() {

        if (!bannerText) return;

        bannerText.textContent =
            "Nenhum aviso importante para hoje.";
    }

    atualizarBanner();

    // =========================
    // Timeline
    // =========================
    const timelineContainer =
        document.getElementById("timelineContainer");

    const rotina = [
        {
            nome: "Português",
            horario: "08:00 - 08:50",
            sala: "Sala 12"
        },
        {
            nome: "Matemática",
            horario: "08:50 - 09:40",
            sala: "Sala 15"
        },
        {
            nome: "Intervalo",
            horario: "09:40 - 10:00",
            sala: "Pátio"
        },
        {
            nome: "Ciências",
            horario: "10:00 - 10:50",
            sala: "Laboratório"
        }
    ];

    function renderizarTimeline() {

        if (!timelineContainer) return;

        timelineContainer.innerHTML = "";

        rotina.forEach((item, index) => {

            const div =
                document.createElement("div");

            div.className =
                "timeline-event-item";

            if (index === 0) {
                div.classList.add("active");
            }

            div.innerHTML = `
                <div>
                    <strong>${item.nome}</strong>
                    <br>
                    <small>${item.horario}</small>
                </div>

                <span>${item.sala}</span>
            `;

            timelineContainer.appendChild(div);
        });
    }

    renderizarTimeline();

    // =========================
    // Card atual
    // =========================
    document.getElementById(
        "currentSubjectName"
    ).textContent = "Português";

    document.getElementById(
        "currentSubjectMeta"
    ).textContent =
        "Sala 12 • 08:00 - 08:50";

    document.getElementById(
        "nextSubjectName"
    ).textContent =
        "Matemática";

    document.getElementById(
        "nextSubjectMeta"
    ).textContent =
        "Sala 15 • 08:50 - 09:40";

    document.getElementById(
        "timeLeftText"
    ).textContent =
        "Faltam 20 minutos";

    document.getElementById(
        "currentProgressFill"
    ).style.width = "60%";

    // =========================
    // Modo Foco
    // =========================
    const checkFocusMode =
        document.getElementById(
            "checkFocusMode"
        );

    if (checkFocusMode) {

        checkFocusMode.addEventListener(
            "change",
            function () {

                document.body.classList.toggle(
                    "focus-mode-active",
                    this.checked
                );
            }
        );
    }

    // =========================
    // Painel de edição
    // =========================
    const checkEditMode =
        document.getElementById(
            "checkEditMode"
        );

    const editPanel =
        document.getElementById(
            "editPanel"
        );

    if (
        checkEditMode &&
        editPanel
    ) {
        checkEditMode.addEventListener(
            "change",
            function () {

                editPanel.classList.toggle(
                    "active",
                    this.checked
                );
            }
        );
    }

    // =========================
    // Salvar edição
    // =========================
    const btnSaveEdit =
        document.getElementById(
            "btnSaveEdit"
        );

    if (btnSaveEdit) {

        btnSaveEdit.addEventListener(
            "click",
            () => {

                alert(
                    "Alterações salvas com sucesso!"
                );
            }
        );
    }

});