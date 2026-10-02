const listaAvisos = document.getElementById("listaAvisos");

async function carregarAvisos() {

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
        listaAvisos.innerHTML = "<p>Nenhum aviso publicado.</p>";
        return;
    }

    listaAvisos.innerHTML = "";

    avisos.forEach(aviso => {

        const categoria = aviso.categorias
            ? aviso.categorias.Nome
            : "Sem categoria";

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
        `;

        listaAvisos.appendChild(card);
    });
}

carregarAvisos();