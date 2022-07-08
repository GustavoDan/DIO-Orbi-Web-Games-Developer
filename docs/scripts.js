linkButton = {
    "Criando%20seu%20jogo%20no%20estilo%20Space%20Shooter/":
        document.querySelector("#space-shooter"),
    "Criando%20seu%20pr%C3%B3prio%20jogo%20da%20velha%20com%20HTML%20e%20Javascript/":
        document.querySelector("#jogo-da-velha"),
    "Criando%20seu%20jogo%20de%20mem%C3%B3ria%20estilo%20Genius/":
        document.querySelector("#genesis"),
    "Construindo%20o%20seu%20primeiro%20jogo%20de%20naves/":
        document.querySelector("#resgate"),
    "Recriando%20o%20famoso%20jogo%20do%20dinossauro%20sem%20internet/":
        document.querySelector("#dinossauro"),
};

Object.keys(linkButton).forEach((link) => {
    linkButton[link].addEventListener(
        "click",
        () => (location.href += `Projetos/${link}`)
    );
});
