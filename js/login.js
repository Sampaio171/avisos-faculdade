const loginForm = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    mensagem.textContent = "Entrando...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mensagem.textContent = "E-mail ou senha incorretos.";
        return;
    }

    mensagem.textContent = "Login realizado!";

    window.location.href = "dashboard.html";
});