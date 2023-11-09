

(function() {
    const socket = io();
    const divProd = document.getElementById("divPro");
  
    socket.on("listProducts", (products) => {
      // Limpia la lista de productos existente antes de agregar nuevos productos
      divProd.innerHTML = '';
  
      products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
          <h1>${product.title} ${product.id}</h1>
          <p>${product.description}</p>
          <p>${product.code}</p>
          <p>${product.price}</p>
          <p>${product.stock}</p>
        `;
        divProd.appendChild(productDiv);
      });
    });
  
    document.getElementById("product-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const newP = {
        title: document.getElementById("titleP").value,
        stock: document.getElementById("stockP").value,
        price: document.getElementById("priceP").value,
        code: document.getElementById("codeP").value,
        description: document.getElementById("descriptionP").value,
      };
      socket.emit("addProduct", newP);
    });

    document.getElementById("delete-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const idValue = document.getElementById("idProd").value;
      
        if (!isNaN(idValue)) { // Comprueba si es un número válido
          const idP = {
            id: idValue.toString(),
          };
          socket.emit("deleteProduct", idP);
        } else {
          alert("Ingresa un número válido en el campo ID.");
        }
      });
  })();