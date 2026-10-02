const avisoForm = document.getElementById("avisoForm");
const categoria = document.getElementById("categoria");
const mensagem = document.getElementById("mensagem");
const cancelar = document.getElementById("cancelar");

// Carregar categorias
async function carregarCategorias() {

    const { data: categorias, error } = await supabaseClient
        .from("categorias")
        .select("*")
        .order("id");

    if (error) {
        console.error("Erro ao carregar categorias:", error);
        mensagem.textContent = "Erro ao carregar categorias.";
        return;
    }

    alert(JSON.stringify(categorias));

    categorias.forEach(cat => {

        const option = document.createElement("option");

        option.value = cat.id;
        option.textContent = cat.Nome;

        categoria.appendChild(option);
    });
}

// Publicar aviso
avisoForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;
    const categoriaId = categoria.value;

    mensagem.textContent = "Publicando...";

    // Pegar usuário logado
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        mensagem.textContent = "Usuário não está logado.";
        return;
    }

    // Salvar aviso
    const { error } = await supabaseClient
        .from("avisos")
        .insert({
            titulo: titulo,
            conteudo: conteudo,
            categoria_id: categoriaId,
            autor_id: user.id,
            criado_em: new Date().toISOString()
        });

    if (error) {
    console.error("Erro ao publicar:", error);
    mensagem.textContent = error.message;
    return;
}

    // Voltar para o dashboard
    window.location.href = "dashboard.html";
});

// Cancelar
cancelar.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Iniciar
carregarCategorias();