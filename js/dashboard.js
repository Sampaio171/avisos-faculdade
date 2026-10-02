const listaAvisos = document.getElementById("listaAvisos");
const usuarioEmail = document.getElementById("usuarioEmail");
const sair = document.getElementById("sair");
const novoAviso = document.getElementById("novoAviso");

novoAviso.addEventListener("click", () => {
    window.location.href = "criar-aviso.html";
});

async function carregarDashboard() {

    // Verifica se existe usuário logado
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    usuarioEmail.textContent = user.email;

    // Busca os avisos
    const { data: avisos, error } = await supabaseClient
        .from("avisos")
        .select(`
            id,
            titulo,
            conteudo,
            criado_em,
            categorias (
                Nome
            )
        `)
        .order("criado_em", { ascending: false });

    if (error) {
        console.error(error);
        listaAvisos.innerHTML = "<p>Erro ao carregar os avisos.</p>";
        return;
    }

    if (!avisos || avisos.length === 0) {
        listaAvisos.innerHTML = "<p>Nenhum aviso cadastrado.</p>";
        return;
    }

    listaAvisos.innerHTML = "";

    avisos.forEach(aviso => {

        const categoria = aviso.categorias
            ? aviso.categorias.Nome
            : "Sem categoria";

        // Formatar data
        const dataAviso = aviso.criado_em
            ? new Date(aviso.criado_em).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short"
            })
            : "Data não informada";

        const card = document.createElement("div");

        card.className = "aviso-card";

        card.innerHTML = `
            <h3>${aviso.titulo}</h3>

            <span>${categoria}</span>

            <p>${aviso.conteudo}</p>

            <small class="data-aviso">
                📅 ${dataAviso}
            </small>

            <button class="btn-excluir" data-id="${aviso.id}">
                Excluir
            </button>
        `;

        listaAvisos.appendChild(card);

        // Botão excluir
        const botaoExcluir = card.querySelector(".btn-excluir");

        botaoExcluir.addEventListener("click", async () => {

            const confirmar = confirm(
                "Tem certeza que deseja excluir este aviso?"
            );

            if (!confirmar) {
                return;
            }

            const { error } = await supabaseClient
                .from("avisos")
                .delete()
                .eq("id", aviso.id);

            if (error) {
                console.error(error);
                alert("Erro ao excluir o aviso.");
                return;
            }

            card.remove();
        });
    });
}

// Botão sair
sair.addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";
});

// Inicia o dashboard
carregarDashboard();